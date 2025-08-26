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

    // Mail de la cuenta secundaria (vendedor)
    const secondaryMail = 'test_user_792057294485026311@testuser.com';
    console.log('🔹 Secondary email:', secondaryMail);

    // Creamos la preferencia
    const result = await preference.create({
      body: {
        items: [
          {
            id: id || 'product-001',
            title: title,
            quantity: quantity,
            unit_price: unit_price ? Number(unit_price) / 100 : 2000, // evita NaN
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
        additional_recipients: [
          {
            email: secondaryMail, // cuenta del vendedor
            type: 'secondary',
            percentage: 95, // vendedor recibe 95%
          },
        ],
      } as any, // TypeScript ignora tipos que todavía no están definidos
    });

    console.log('✅ Preferencia creada:', result);

    res.json({ preferenceId: result.id, init_point: result.init_point });
  } catch (error: any) {
    console.error('❌ Error al crear preferencia:', error);
    res
      .status(500)
      .json({ error: 'Error al crear preferencia', details: error });
  }
});

export default mercadoPago;
