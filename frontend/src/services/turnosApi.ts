import { api } from './api';
import type { EntityData } from './api';
const token = localStorage.getItem('token');
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

    return api.get(url, { headers: { Authorization: `Bearer ${token}` } });
  },
  getByPrestadorId: (
    id: string,
    cantItemsPerPage: string,
    currentPage: string,
    selectedValueShow?: string,
    selectedValueOrder?: string,
    searchQuery?: string
  ) => {
    // Construir la URL usando un array para evitar dobles barras
    const parts = [
      'turno',
      'byPrestador',
      id,
      cantItemsPerPage,
      currentPage,
      selectedValueShow || 'all',
    ];

    // Agregar selectedValueOrder solo si hay valor o si necesitamos searchQuery
    if (selectedValueOrder && selectedValueOrder !== '') {
      parts.push(selectedValueOrder);
    } else if (searchQuery && searchQuery.trim() !== '') {
      // Si hay searchQuery pero no selectedValueOrder, usar placeholder
      parts.push('none'); // placeholder que el backend reconocerá como vacío
    }

    // Agregar searchQuery si hay
    if (searchQuery && searchQuery.trim() !== '') {
      parts.push(encodeURIComponent(searchQuery.trim()));
    }

    const url = '/' + parts.join('/');
    console.log('URL construida:', url);
    return api.get(url);
  },
  create: (data: EntityData) => api.post('/turno', data),
  createCookie: (data: EntityData) => api.post('/turno/cookie', data),
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
