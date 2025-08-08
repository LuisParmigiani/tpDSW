import { api } from './api';
import type { EntityData } from './api';

export const tiposServicioApi = {
  getAll: () => api.get('/serviceTypes'),
  getById: (id: string) => api.get(`/serviceTypes/${id}`),
  create: (data: EntityData) => api.post('/serviceTypes', data),
  update: (id: string, data: EntityData) =>
    api.put(`/serviceTypes/${id}`, data),
  delete: (id: string) => api.delete(`/serviceTypes/${id}`),
};
