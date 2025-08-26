import { api } from './api';
import type { EntityData } from './api';
export const pagoApi = {
  getAll: () => api.get('/pago'),
  getById: (id: string) => api.get(`/pago/${id}`),
  create: (data: EntityData) => api.post('/pago', data),
  update: (id: string, data: EntityData) => api.put(`/pago/${id}`, data),
  delete: (id: string) => api.delete(`/pago/${id}`),
};
