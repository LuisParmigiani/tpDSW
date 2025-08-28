import { api } from './api';
import type { EntityData } from './api';

export const turnosApi = {
  getAll: () => api.get('/turno'),
  getById: (id: string) => api.get(`/turno/${id}`),
  getByUserId: (
    cantItemsPerPage: string,
    currentPage: string,
    selectedValueShow?: string,
    selectedValueOrder?: string
  ) => {
    // Construir la URL con parámetros en la ruta como espera el backend
    // Usar 'all' como valor por defecto para selectedValueShow si está vacío
    const filterValue = selectedValueShow || 'all';
    const orderValue = selectedValueOrder || '';
    
    let url = `/turno/byUser/${cantItemsPerPage}/${currentPage}/${filterValue}`;
    if (orderValue) {
      url += `/${orderValue}`;
    }

    return api.get(url, { withCredentials: true });
  },
  getByPrestadorId: (
    id: string,
    cantItemsPerPage: string,
    currentPage: string,
    selectedValueShow?: string,
    selectedValueOrder?: string
  ) => {
    // Construir la URL para obtener turnos como prestatario
    let url = `/turno/byPrestador/${id}/${cantItemsPerPage}/${currentPage}`;
    
    // Siempre agregar selectedValueShow (vacío si no hay filtro)
    url += `/${selectedValueShow || ''}`;
    
    // Agregar selectedValueOrder solo si hay uno
    if (selectedValueOrder) {
      url += `/${selectedValueOrder}`;
    }

    return api.get(url);
  },
  create: (data: EntityData) => api.post('/turno', data),
  update: (id: string, data: EntityData) => api.put(`/turno/${id}`, data),
  patch: (id: string, data: EntityData) => api.patch(`/turno/${id}`, data),
  delete: (id: string) => api.delete(`/turno/${id}`),
  getTurnsPerDay: (id: string, date: string) =>
    api.get(`turno/turnosPorDia/${id}/${date}`),

  // Métodos específicos para el dashboard del prestatario
  updateMultipleEstados: async (turnoIds: number[], nuevoEstado: string) => {
    // Convertir el estado a minúsculas antes de enviar a la BD
    const estadoMinusculas = nuevoEstado.toLowerCase();

    // Realizar actualizaciones en paralelo siguiendo el patrón de tu API
    return Promise.all(
      turnoIds.map((id) =>
        api.patch(`/turno/${id}`, { estado: estadoMinusculas })
      )
    );
  },
};
