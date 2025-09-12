import { api } from './api';
import type { EntityData } from './api';

export interface EstadisticasPagos {
  ingresosMes: number;   // Ingresos del mes actual
  ingresosAnio: number;  // Ingresos totales (todos los tiempos) 
  clientesMes: number;   // Clientes del mes actual
  clientesAnio: number;  // Clientes totales (todos los tiempos)
}

export interface EstadisticasResponse {
  message: string;
  data: EstadisticasPagos;
}

export const pagoApi = {
  getAll: () => api.get('/pago'),
  getById: (id: string) => api.get(`/pago/${id}`),
  getEstadisticasByUser: (usuarioId: number) => 
    api.get(`/pago/estadisticas/${usuarioId}`),
  create: (data: EntityData) => api.post('/pago', data),
  update: (id: string, data: EntityData) => api.put(`/pago/${id}`, data),
  delete: (id: string) => api.delete(`/pago/${id}`),
};
