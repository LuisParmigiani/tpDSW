import { api } from './api';
import type { EntityData } from './api';

export const usuariosApi = {
  getAll: () => api.get('/usuario'),
  getPrestatariosByTipoServicioAndZona: (
    tipoServicio: string,
    zona: string,
    orderBy: string
  ) => api.get(`/usuario/prestatarios/${tipoServicio}/${zona}/${orderBy}`),
  getById: (id: string) => api.get(`/usuario/${id}`),
  getCommentsByUserId: (
    userId: string,
    maxItems?: string,
    page?: string,
    orderBy?: string
  ) => {
    const params = new URLSearchParams(); // crea los parámetros para pasarlos en la consulta
    if (maxItems !== undefined) params.append('maxItems', maxItems);
    if (page !== undefined) params.append('page', page);
    if (orderBy !== undefined) params.append('orderBy', orderBy);

    const url = `/usuario/comments/${userId}${params ? `?${params}` : ''}`;
    return api.get(url);
  },
  create: (data: EntityData) => api.post('/usuario', data),
  update: (id: string, data: EntityData) => api.put(`/usuario/${id}`, data),
  delete: (id: string) => api.delete(`/usuario/${id}`),
};
