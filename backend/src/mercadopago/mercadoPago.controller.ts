import { MercadoPagoConfig, Preference } from 'mercadopago';
import express, { Request, Response } from 'express';

const mercadoPago = express.Router();

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

const preference = new Preference(client);

mercadoPago.post('/', async (req: Request, res: Response) => {
  try {
    const { id, title, quantity, unit_price, secondaryEmail, turno } = req.body;
    console.log('Creating preference with data:', req.body);

    // email del vendedor (secundario)
    const mail = 'test_user_792057294485026311@testuser.com';

    const result = await preference.create({
      body: {
        items: [
          {
            id: id || 'product-001',
            title: title || 'My product',
            quantity: quantity || 1,
            unit_price: unit_price / 100 || 2000,
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
        external_reference: turno,
        marketplace: {
          // tu cuenta principal recibe 5%
          marketplace_fee: 5, // porcentaje para tu cuenta
        },
        additional_recipients: [
          {
            email: mail, // vendedor recibe el resto
            type: 'secondary',
            percentage: 95,
          },
        ],
      } as any,
    });

    console.log('Preference creada:', result.id);
    res.json({ preferenceId: result.id });
  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res
      .status(500)
      .json({ error: 'Error al crear preferencia', details: error });
  }
});

export default mercadoPago;
