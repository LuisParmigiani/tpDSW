import { MercadoPagoConfig, Preference } from 'mercadopago';
import express, { Request, Response } from 'express';
import { getOauth } from './../usuario/usuario.controler.js';

interface AuthRequest extends Request {
  user?: {
    id: string;
    rol: string;
  };
}

async function createPayment(req: AuthRequest, res: Response) {
  console.log('🔹 Creando pago:', req.body);
  try {
    const {
      title,
      description,
      currency,
      quantity,
      unit_price,
      turno,
      prestatario_id,
    } = req.body;
    const id = req.user?.id;

    if (!id) {
      console.log('❌ Usuario no autenticado');
      return res.status(400).json({ message: 'Usuario no autenticado' });
    }

    // Validación básica
    if (!title || !unit_price || !quantity) {
      console.log('❌ Faltan datos requeridos: title, unit_price o quantity');
      return res.status(400).json({
        error: 'Faltan datos requeridos: title, unit_price o quantity',
      });
    }

    if (!prestatario_id) {
      console.log('❌ Se requiere el id del prestatario para el split payment');
      return res.status(400).json({
        error: 'Se requiere el id del prestatario para el split payment',
      });
    }

    const prestatario = await getOauth(Number(prestatario_id));
    if (!prestatario) {
      console.log('❌ Prestatario no encontrado');
      return res.status(404).json({
        error: 'Prestatario no encontrado',
      });
    }

    // VERIFICAR QUE TENGA TOKEN OAUTH
    if (!prestatario.mpAccessToken) {
      console.log('❌ El prestatario no tiene token OAuth configurado');
      return res.status(400).json({
        error: 'El prestatario no tiene token OAuth configurado',
      });
    }

    const cliente = await getOauth(Number(id));

    // Calculamos los montos del split
    const totalAmount = Number(unit_price) * Number(quantity);
    const marketplaceFee = Math.round(totalAmount * 0.05); // 5% para ti
    const vendorAmount = totalAmount - marketplaceFee; // 95% para el vendedor

    console.log('🔹 💰 Split calculado:', {
      total: totalAmount,
      marketplaceFee: marketplaceFee,
      vendorAmount: vendorAmount,
    });

    // ⭐ USAR TU TOKEN PARA CREAR LA PREFERENCIA
    const mpAccessToken = process.env.MP_ACCESS_TOKEN;
    if (!mpAccessToken) {
      console.log('❌ MP_ACCESS_TOKEN no está definido');
      return res.status(500).json({
        error: 'MP_ACCESS_TOKEN no está definido',
      });
    }

    const marketplaceClient = new MercadoPagoConfig({
      accessToken: mpAccessToken,
    });

    const marketplacePreference = new Preference(marketplaceClient);

    // ⭐ CONFIGURACIÓN CORREGIDA PARA ARGENTINA - SIN application_fee
    const preferenceData = {
      items: [
        {
          id: turno || 'product-001',
          title: title,
          quantity: Number(quantity),
          unit_price: Number(unit_price),
          currency_id: 'ARS',
        },
      ],
      back_urls: {
        success: 'https://reformix.site/historial/success',
        failure: 'https://reformix.site/historial/failure',
        pending: 'https://reformix.site/historial/pending',
      },
      auto_return: 'approved',
      notification_url:
        'https://backend-patient-morning-1303.fly.dev/api/mercadopago/cambio',
      external_reference: turno || undefined,

      // ⭐ INFORMACIÓN DEL COMPRADOR
      payer: {
        name: cliente.nombre,
        email: cliente.mail,
        identification: {
          type: 'DNI',
          number: cliente.numeroDoc?.toString(),
        },
      },

      // ⭐ REMOVER application_fee - No funciona en Argentina
      // application_fee: marketplaceFee, // ❌ ESTO CAUSA PROBLEMAS

      // ⭐ METADATA COMPLETA para el webhook
      metadata: {
        cliente_id: id,
        prestatario_id: prestatario_id,
        turno_id: turno,
        split_fee: marketplaceFee,
        vendor_amount: vendorAmount,
        vendor_access_token: prestatario.mpAccessToken,
        client_email: cliente.mail,
        vendor_email: prestatario.mail,
        marketplace_user_id: process.env.PLATFORM_USER_ID,
        vendor_user_id: prestatario.mpUserId, // ASEGÚRATE DE TENER ESTE CAMPO
        total_amount: totalAmount,
        split_method: 'manual_transfer', // Indicar que será manual
      },

      // ⭐ CONFIGURACIONES ADICIONALES PARA EVITAR ERRORES
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 1, // Forzar 1 cuota para simplificar
      },

      // ⭐ CONFIGURACIÓN DE EXPERIENCIA MEJORADA
      additional_info: `Compra de ${title} por ${cliente.nombre || ''} (${
        cliente.mail || ''
      })`,
    };

    console.log(
      '🔹 Preferencia data:',
      JSON.stringify(preferenceData, null, 2)
    );

    // ⭐ CREAR PREFERENCIA
    const result = await marketplacePreference.create({
      body: preferenceData,
    });

    console.log('🔹 ✅ Preferencia creada exitosamente:', {
      id: result.id,
      total_amount: totalAmount,
      marketplace_fee: marketplaceFee,
      vendor_amount: vendorAmount,
    });

    res.json({
      preferenceId: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
      split_info: {
        total_amount: totalAmount,
        marketplace_fee: marketplaceFee,
        vendor_amount: vendorAmount,
        marketplace_percentage: 5,
        vendor_percentage: 95,
        method: 'manual_transfer',
      },
    });
  } catch (error: any) {
    console.log('🔹 Error completo:', error);
    console.error('❌ Error al crear preferencia:', error);

    // ⭐ RESPUESTA DETALLADA DEL ERROR
    res.status(500).json({
      error: 'Error al crear preferencia con split payment',
      details: error.message || error,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      raw_error: error,
    });
  }
}

export default createPayment;
