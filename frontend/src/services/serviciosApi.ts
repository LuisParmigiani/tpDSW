import { api } from './api';
import type { EntityData } from './api';

export const serviciosApi = {
  getAll: () => api.get('/servicio'),
  getById: (id: string) => api.get(`/servicio/${id}`),
  create: (data: EntityData) => api.post('/servicio', data),
  update: (id: string, data: EntityData) => api.put(`/servicio/${id}`, data),
  delete: (id: string) => api.delete(`/servicio/${id}`),
};
