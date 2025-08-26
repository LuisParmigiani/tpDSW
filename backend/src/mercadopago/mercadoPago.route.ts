import { Router } from 'express';
import {
  mercadoPagoWebhook,
  verificarEstadoPago,
} from './mercadoPagoWebhook.js';

const webhookRouter = Router();

// Webhook de MercadoPago (lo que necesitas principalmente)
webhookRouter.post('/webhooks/mercadopago', mercadoPagoWebhook);

// Ruta auxiliar para verificar estado manualmente
webhookRouter.post('/verificar-pago/:idMercadoPago', verificarEstadoPago);

export { webhookRouter };
