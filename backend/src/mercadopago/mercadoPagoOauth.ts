import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import axios from 'axios';
import querystring from 'querystring';

const router = express.Router();

// tus credenciales de app
const MP_CLIENT_ID = process.env.MP_CLIENT_ID;
const MP_CLIENT_SECRET = process.env.MP_CLIENT_SECRET;
const MP_REDIRECT_URI = process.env.MP_REDIRECT_URI; // la que configuraste en MP

const MP_AUTH_URL = 'https://auth.mercadopago.com/authorization';
const MP_TOKEN_URL = 'https://api.mercadopago.com/oauth/token';
const MP_PAYMENTS_URL = 'https://api.mercadopago.com/v1/payments';

// 1) Iniciar OAuth
router.get('/connect', (req: Request, res: Response) => {
  const url = `${MP_AUTH_URL}?response_type=code&client_id=${MP_CLIENT_ID}&redirect_uri=${MP_REDIRECT_URI}`;
  console.log('Redirigiendo a:', url);
  res.redirect(url);
});

// 2) Callback OAuth
router.get('/callback', async (req: Request, res: Response) => {
  const rawCode = req.query.code;
  let code: string = '';
  if (typeof req.query.code === 'string') {
    code = req.query.code;
  } else if (
    Array.isArray(req.query.code) &&
    typeof req.query.code[0] === 'string'
  ) {
    code = req.query.code[0];
  }
  if (!code) return res.status(400).send('Falta code');

  try {
    const params = querystring.stringify({
      grant_type: 'authorization_code',
      client_id: MP_CLIENT_ID,
      client_secret: MP_CLIENT_SECRET,
      code: code,
      redirect_uri: MP_REDIRECT_URI,
    });

    const tokenResp = await axios.post(MP_TOKEN_URL, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const body = tokenResp.data;

    console.log('=== TOKENS DEL VENDEDOR ===');
    console.log(body);

    res.json({ ok: true, body });
  } catch (err) {
    const error = err as any;
    console.error('Error en callback:', error.response?.data || error.message);
    res.status(500).send('Error en callback OAuth');
  }
});

// 3) Refrescar token (ejemplo)
router.post('/refresh', async (req: Request, res: Response) => {
  const { refresh_token } = req.body;
  if (!refresh_token) return res.status(400).send('Falta refresh_token');

  try {
    const params = querystring.stringify({
      grant_type: 'refresh_token',
      client_id: MP_CLIENT_ID,
      client_secret: MP_CLIENT_SECRET,
      refresh_token,
    });

    const tokenResp = await axios.post(MP_TOKEN_URL, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const body = tokenResp.data;
    console.log('=== REFRESH TOKEN ===');
    console.log(body);

    res.json({ ok: true, body });
  } catch (err) {
    const error = err as any;
    console.error(
      'Error refresh token:',
      error.response?.data || error.message
    );
    res.status(500).send('Error refrescando token');
  }
});

// 4) Crear pago (simulado con access_token del vendedor)
router.post('/create-payment', async (req: Request, res: Response) => {
  const {
    access_token,
    transaction_amount,
    token,
    payment_method_id = 'visa',
    payer_email,
  } = req.body;

  if (!access_token || !transaction_amount || !token || !payer_email) {
    return res.status(400).send('Faltan campos');
  }

  try {
    const payload = {
      transaction_amount,
      token,
      description: `Pago de prueba`,
      payment_method_id,
      payer: { email: payer_email },
      application_fee: Math.round(transaction_amount * 0.05 * 100) / 100,
    };

    const response = await axios.post(MP_PAYMENTS_URL, payload, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('=== PAGO CREADO ===');
    console.log(response.data);

    res.json(response.data);
  } catch (err) {
    if (typeof err === 'object' && err !== null && 'response' in err) {
      const error = err as { response?: { data?: any }; message?: string };
      console.error(
        'Error creando pago:',
        error.response?.data || error.message
      );
    } else {
      console.error('Error creando pago:', (err as Error).message);
    }
    res.status(500).send('Error creando pago');
  }
});

// 5) Webhook
router.post('/webhooks', (req: Request, res: Response) => {
  console.log('Webhook recibido:', req.body);
  res.status(200).send('ok');
});

export default router;
