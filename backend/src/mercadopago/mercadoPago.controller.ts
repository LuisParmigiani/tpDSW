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
    const id = req.user?.id; // cookie

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

    let prestatario;
    if (prestatario_id === undefined) {
      console.log('❌ Se requiere el id del prestatario para el split payment');
      return res.status(400).json({
        error: 'Se requiere el id del prestatario para el split payment',
      });
    } else {
      prestatario = await getOauth(Number(prestatario_id));
      if (!prestatario) {
        console.log('❌ Prestatario no encontrado');
        return res.status(404).json({
          error: 'Prestatario no encontrado',
        });
      }
    }

    // VERIFICAR QUE TENGA TOKEN OAUTH
    if (!prestatario.mpAccessToken) {
      console.log('❌ El prestatario no tiene token OAuth configurado');
      return res.status(400).json({
        error: 'El prestatario no tiene token OAuth configurado',
      });
    }

    const cliente = await getOauth(Number(id));

    console.log('🔹 Creando preferencia con split payment:', req.body);

    // Calculamos los montos del split
    const totalAmount = Number(unit_price) * Number(quantity);
    const marketplaceFee = Math.round(totalAmount * 0.05); // 5% para ti (marketplace)
    const vendorAmount = totalAmount - marketplaceFee; // 95% para el vendedor

    console.log('🔹 💰 Split calculado:', {
      total: totalAmount,
      marketplaceFee: marketplaceFee,
      vendorAmount: vendorAmount,
    });

    //  CREAR CLIENTE CON TOKEN DEL PRESTATARIO (VENDEDOR)
    const mpAccessToken = prestatario.mpAccessToken;
    if (!mpAccessToken) {
      console.log(
        '❌ MP_ACCESS_TOKEN no está definido en las variables de entorno: ',
        process.env
      );
      return res.status(500).json({
        error: 'MP_ACCESS_TOKEN no está definido en las variables de entorno',
      });
    }
    const vendorClient = new MercadoPagoConfig({
      accessToken: mpAccessToken,
    });

    const vendorPreference = new Preference(vendorClient);

    // Configuración de la preferencia con split payment
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
      marketplace: `MP-MKT-${process.env.MERCADOPAGO_COLLECTOR_ID}`,

      // ⭐ CONFIGURACIÓN CORRECTA DEL SPLIT
      marketplace_fee: marketplaceFee, // Tu 5% de comisión

      // ⭐ INFORMACIÓN DEL COMPRADOR
      payer: {
        name: cliente.nombre,
        email: cliente.mail,
        identification: {
          type: 'DNI', // o el tipo que uses
          number: cliente.numeroDoc?.toString(),
        },
      },

      metadata: {
        cliente_id: id,
        prestatario_id: prestatario_id,
        turno_id: turno,
        split_fee: marketplaceFee,
        client_email: cliente.mail,
        vendor_email: prestatario.mail,
      },
    };

    // ⭐ CREAR CON EL CLIENTE DEL VENDEDOR
    const result = await vendorPreference.create({
      body: preferenceData,
    });

    console.log('🔹 ✅ Preferencia creada con split payment:', {
      id: result.id,
      marketplace_fee: marketplaceFee,
      vendor_amount: vendorAmount,
    });
    console.log('🔹 Respuesta de MercadoPago:', result);
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
      },
    });
  } catch (error: any) {
    console.log('🔹 entro al error', error);
    console.error('❌ Error al crear preferencia con split:', error);
    res.status(500).json({
      error: 'Error al crear preferencia con split payment',
      details: error.message || error,
    });
  }
}

export default createPayment;
