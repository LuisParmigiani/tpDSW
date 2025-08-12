import { api } from './api';
import type { EntityData } from './api';

export const turnosApi = {
  getAll: () => api.get('/turno'),
  getById: (id: string) => api.get(`/turno/${id}`),
  getByUserId: (
    id: string,
    cantItemsPerPage: string,
    currentPage: string,
    selectedValueShow?: string,
    selectedValueOrder?: string
  ) => {
    // Construir la URL con parámetros en la ruta como espera el backend
    let url = `/turno/byUser/${id}/${cantItemsPerPage}/${currentPage}`;
    if (selectedValueShow) {
      url += `/${selectedValueShow}`;
    }
    if (selectedValueOrder) {
      url += `/${selectedValueOrder}`;
    }
    return api.get(url);
  },
  create: (data: EntityData) => api.post('/turno', data),
  update: (id: string, data: EntityData) => api.put(`/turno/${id}`, data),
  delete: (id: string) => api.delete(`/turno/${id}`),
  getTurnsPerDay: (id: string, date: string) =>
    api.get(`turno/turnosPorDia/${id}/${date}`),
};
