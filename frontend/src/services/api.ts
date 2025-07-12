//axios es una librería que permite hacer peticiones HTTP
import axios from 'axios';

// El puerto del backend donde quiere hacer las peticiones
const API_BASE_URL = 'http://localhost:3000/api';

// ====== INTERFACES Y TIPOS ======

/**
 * Interfaz genérica para estandarizar las respuestas del API
 * @template T - Tipo de datos que contiene la respuesta
 * @property data - Los datos principales de la respuesta
 * @property status - Código de estado HTTP (200, 404, 500, etc.)
 * @property message - Mensaje opcional descriptivo (para errores o información adicional)
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

/**
 * Interfaz flexible para representar cualquier entidad con propiedades dinámicas
 * Permite que un objeto tenga cualquier cantidad de propiedades con cualquier tipo de valor
 */
export interface EntityData {
  [key: string]: unknown;
}

// ====== CONFIGURACIÓN DE AXIOS ======
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ====== INTERCEPTORES ======

/**
 * Interceptor de respuestas: Maneja automáticamente todas las respuestas del servidor
 * - Si la respuesta es exitosa: la retorna sin modificaciones
 * - Si hay un error: lo registra en consola y rechaza la promesa para manejo posterior
 */
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
    update: (id: string, data: EntityData) =>
      api.put(`/serviceTypes/${id}`, data),
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
