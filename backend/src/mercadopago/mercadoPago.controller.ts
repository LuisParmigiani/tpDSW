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
    console.log('Creating preference with data:', secondaryEmail);

    const mail = 'test_user_792057294485026311@testuser.com';
    console.log('Creating preference with secondary email:', mail);
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
        additional_recipients: [
          {
            email: mail, // cuenta del vendedor
            type: 'secondary',
            percentage: 95, // el vendedor recibe 95%
          },
        ],
      } as any,
    });
    res.json({ preferenceId: result.id });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error al crear preferencia', details: error });
  }
});

export default mercadoPago;
