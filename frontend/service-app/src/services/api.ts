import axios from 'axios';

// Configuración base de Axios
const API_BASE_URL = 'http://localhost:3000/api';

// Tipos básicos para las entidades
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface EntityData {
  [key: string]: unknown;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la petición:', error);
    return Promise.reject(error);
  }
);

// Servicios para cada entidad
export const apiServices = {
  // Usuarios
  usuarios: {
    getAll: () => api.get('/usuario'),
    getById: (id: string) => api.get(`/usuario/${id}`),
    create: (data: EntityData) => api.post('/usuario', data),
    update: (id: string, data: EntityData) => api.put(`/usuario/${id}`, data),
    delete: (id: string) => api.delete(`/usuario/${id}`),
  },

  // Servicios
  servicios: {
    getAll: () => api.get('/servicio'),
    getById: (id: string) => api.get(`/servicio/${id}`),
    create: (data: EntityData) => api.post('/servicio', data),
    update: (id: string, data: EntityData) => api.put(`/servicio/${id}`, data),
    delete: (id: string) => api.delete(`/servicio/${id}`),
  },

  // Turnos
  turnos: {
    getAll: () => api.get('/turno'),
    getById: (id: string) => api.get(`/turno/${id}`),
    create: (data: EntityData) => api.post('/turno', data),
    update: (id: string, data: EntityData) => api.put(`/turno/${id}`, data),
    delete: (id: string) => api.delete(`/turno/${id}`),
  },

  // Tareas
  tareas: {
    getAll: () => api.get('/tarea'),
    getById: (id: string) => api.get(`/tarea/${id}`),
    create: (data: EntityData) => api.post('/tarea', data),
    update: (id: string, data: EntityData) => api.put(`/tarea/${id}`, data),
    delete: (id: string) => api.delete(`/tarea/${id}`),
  },

  // Zonas
  zonas: {
    getAll: () => api.get('/zona'),
    getById: (id: string) => api.get(`/zona/${id}`),
    create: (data: EntityData) => api.post('/zona', data),
    update: (id: string, data: EntityData) => api.put(`/zona/${id}`, data),
    delete: (id: string) => api.delete(`/zona/${id}`),
  },

  // Tipos de servicio
  tiposServicio: {
    getAll: () => api.get('/serviceTypes'),
    getById: (id: string) => api.get(`/serviceTypes/${id}`),
    create: (data: EntityData) => api.post('/serviceTypes', data),
    update: (id: string, data: EntityData) => api.put(`/serviceTypes/${id}`, data),
    delete: (id: string) => api.delete(`/serviceTypes/${id}`),
  },

  // Horarios
  horarios: {
    getAll: () => api.get('/horario'),
    getById: (id: string) => api.get(`/horario/${id}`),
    create: (data: EntityData) => api.post('/horario', data),
    update: (id: string, data: EntityData) => api.put(`/horario/${id}`, data),
    delete: (id: string) => api.delete(`/horario/${id}`),
  },
};

export default api;
