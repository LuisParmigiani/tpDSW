import { MercadoPagoConfig, Preference } from 'mercadopago';
import express, { Request, Response } from 'express';

const mercadoPago = express.Router();

const client = new MercadoPagoConfig({
  accessToken:
    'APP_USR-2293500865517451-082613-979e1c2aced1aab294b9fdf13f9d5aba-2653266304',
});

const preference = new Preference(client);

mercadoPago.post('/', async (req: Request, res: Response) => {
  try {
    const { id, title, quantity, unit_price } = req.body;
    console.log('Creating preference with data:', req.body);

    const result = await preference.create({
      body: {
        items: [
          {
            id: id || 'product-001',
            title: title || 'My product',
            quantity: quantity || 1,
            unit_price: unit_price || 2000,
          },
        ],
        back_urls: {
          success: 'https://reformix.site/turnHistory/success',
          failure: 'https://reformix.site/turnHistory/failure',
          pending: 'https://reformix.site/turnHistory/pending',
        },
        auto_return: 'approved',
        notification_url: 'https://reformix.site/webhooks/mercadopago/cambio',
      },
    });
    res.json({ preferenceId: result.id });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error al crear preferencia', details: error });
  }
});

export default mercadoPago;
