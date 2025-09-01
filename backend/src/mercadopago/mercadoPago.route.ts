import { Router } from 'express';
import {
  mercadoPagoWebhook,
  verificarEstadoPago,
} from './mercadoPagoWebhook.js';
import mPOauth from './mPOauth.js';
const { connect, callback, refresh, status } = mPOauth;

const webhookRouter = Router();

webhookRouter.post('/cambio', mercadoPagoWebhook);
webhookRouter.post('/verificar-pago/:idMercadoPago', verificarEstadoPago);
webhookRouter.get('/oauth/connect', connect);
webhookRouter.get('/oauth/callback', callback);
webhookRouter.post('/oauth/refresh', refresh);
webhookRouter.get('/oauth/status', status);

export { webhookRouter };
