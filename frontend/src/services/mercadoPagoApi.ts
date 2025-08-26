import { api } from './api';
import type { EntityData } from './api';
export const mercadoPagoApi = {
  create: (data: EntityData) => api.post('/mercadoPago', data),
};
