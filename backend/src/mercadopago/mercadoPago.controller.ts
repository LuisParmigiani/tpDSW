import { MercadoPagoConfig, Preference } from 'mercadopago';
import express, { Request, Response } from 'express';

const mercadoPago = express.Router();

// Inicializamos cliente de Mercado Pago con token de sandbox
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!, // asegurate que sea de prueba si estás en sandbox
});

const preference = new Preference(client);

mercadoPago.post('/', async (req: Request, res: Response) => {
  try {
    const { id, title, quantity, unit_price, secondaryEmail, turno } = req.body;

    // Validación básica
    if (!title || !unit_price || !quantity) {
      return res.status(400).json({
        error: 'Faltan datos requeridos: title, unit_price o quantity',
      });
    }

    console.log('🔹 Creando preferencia con data:', req.body);
    // TODO: Reemplaza 'ID_DEL_VENDEDOR_SECUNDARIO' por el user_id real del vendedor secundario (mail de prueba)
    const result = await preference.create({
      body: {
        items: [
          {
            id: id || 'product-001',
            title: title,
            quantity: Number(quantity),
            unit_price: Number(unit_price),
            currency_id: 'ARS',
          },
        ],
        back_urls: {
          success: 'https://reformix.site/turnHistory/success',
          failure: 'https://reformix.site/turnHistory/failure',
          pending: 'https://reformix.site/turnHistory/pending',
        },
        auto_return: 'approved',
        notification_url:
          'https://backend-patient-morning-1303.fly.dev/webhooks/mercadopago/cambio',
        external_reference: turno || undefined,
        marketplace: 'Reformix',
        marketplace_fee: 5, // comisión que retiene tu cuenta principal (ARS)
        // El collector principal es el vendedor secundario
        collector_id: '123',
        payer: 'test_user_792057294485026311@testuser.com',
      } as any,
    });

    console.log('✅ Preferencia creada:', result);

    res.json({
      preferenceId: result.id,
      init_point: result.init_point, // URL para redirigir al checkout
      sandbox_init_point: result.sandbox_init_point, // URL de sandbox (si corresponde)
    });
  } catch (error: any) {
    console.error('❌ Error al crear preferencia:', error);
    res.status(500).json({
      error: 'Error al crear preferencia',
      details: error.message || error,
    });
  }
});

export default mercadoPago;
