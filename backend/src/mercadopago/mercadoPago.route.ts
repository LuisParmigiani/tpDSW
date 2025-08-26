import { Router } from 'express';
import {
  mercadoPagoWebhook,
  verificarEstadoPago,
} from './mercadoPagoWebhook.js';

const webhookRouter = Router();

webhookRouter.post('/', mercadoPagoWebhook);
webhookRouter.post('/verificar-pago/:idMercadoPago', verificarEstadoPago);

export { webhookRouter };
