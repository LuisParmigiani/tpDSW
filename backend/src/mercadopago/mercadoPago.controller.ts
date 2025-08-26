import { MercadoPagoConfig, Preference } from 'mercadopago';
import express, { Request, Response } from 'express';

const mercadoPago = express.Router();

const client = new MercadoPagoConfig({
  accessToken:
    'APP_USR-1777516730223771-082213-35cb69b2ccbb72db735ddd24258f44dc-386912703',
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
          success: 'https://localhost:5173/turnHistory/success',
          failure: 'https://localhost:5173/turnHistory/failure',
          pending: 'https://localhost:5173/turnHistory/pending',
        },
        auto_return: 'approved',
        notification_url: 'https://localhost:3000/api/mercadopago/webhook',
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
