//axios es una librería que permite hacer peticiones HTTP
import axios from 'axios';

// El puerto del backend donde quiere hacer las peticiones
const local = true; // con true es en local y con false para subir a producción
const API_BASE_URL = local
  ? 'http://localhost:3000/api'
  : 'https://backend-patient-morning-1303.fly.dev/api';

// ====== INTERFACES Y TIPOS ======

/**
 * Interfaz flexible para representar cualquier entidad con propiedades dinámicas
 * Permite que un objeto tenga cualquier cantidad de propiedades con cualquier tipo de valor
 */
export interface EntityData {
  [key: string]: unknown;
}

// ====== CONFIGURACIÓN DE AXIOS ======
export const api = axios.create({
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
