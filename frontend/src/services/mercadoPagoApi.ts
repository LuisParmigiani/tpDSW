import { api } from './api';
import type { EntityData } from './api';
export const mercadoPagoApi = {
  // Ajuste: llamar al endpoint montado en /api/mercadopago
  create: (data: EntityData) =>
    api.post('/mercadopago/crear-pago', data, { withCredentials: true }),

  // OAuth endpoints
  connect: (userId: number) =>
    api.get('/mercadopago/oauth/connect', { params: { userId } }),
  callback: (params: Record<string, string>) =>
    api.get('/mercadopago/oauth/callback', { params }),
  refresh: () => api.post('/mercadopago/oauth/refresh'),
  status: () => api.get('/mercadopago/oauth/status'),

  // Payment verification
  verifyPayment: (idMercadoPago: string) =>
    api.post(`/mercadopago/verificar-pago/${idMercadoPago}`),
};
