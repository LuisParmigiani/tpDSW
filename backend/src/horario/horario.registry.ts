import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import {
  createHorarioValidation,
  updateHorarioValidation,
  horarioSchema,
  idParamValidation,
  errorResponseSchema,
} from './horario.schemas.js';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// Extender Zod con OpenAPI
extendZodWithOpenApi(z);

// Crear el horarioRegistry
export const horarioRegistry = new OpenAPIRegistry();

// Registrar esquemas
horarioRegistry.register('CreateHorario', createHorarioValidation);
horarioRegistry.register('UpdateHorario', updateHorarioValidation);
horarioRegistry.register('Horario', horarioSchema);
horarioRegistry.register('IdParam', idParamValidation);

// ==================== POST METHODS ====================

// POST /api/horario
horarioRegistry.registerPath({
  method: 'post',
  path: '/api/horario',
  description: 'Crear un nuevo horario para un usuario determinado',
  summary: 'Crear horario',
  tags: ['Horarios'],
  request: {
    body: {
      description: 'Datos del horario a crear ',
      content: {
        'application/json': {
          schema: createHorarioValidation,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Horario creado exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z
              .string()
              .openapi({ example: 'Horario creado exitosamente' }),
            data: horarioSchema,
          }),
        },
      },
    },
    400: {
      description: 'Error de validación',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: 'Error interno del servidor',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// ==================== GET METHODS ====================

// GET /api/horario/{id}
horarioRegistry.registerPath({
  method: 'get',
  path: '/api/horario/{id}',
  description: 'Obtener un horario por ID',
  summary: 'Obtener horario',
  tags: ['Horarios'],
  request: {
    params: idParamValidation,
  },
  responses: {
    200: {
      description: 'Horario encontrado',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Horario encontrado' }),
            data: horarioSchema,
          }),
        },
      },
    },
    404: {
      description: 'Horario no encontrado',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: 'Error interno del servidor',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// ==================== PUT METHODS ====================

// PUT /api/horario/{id}
horarioRegistry.registerPath({
  method: 'put',
  path: '/api/horario/{id}',
  description: 'Actualizar un horario existente',
  summary: 'Actualizar horario',
  tags: ['Horarios'],
  request: {
    params: idParamValidation,
    body: {
      description: 'Datos del horario a actualizar',
      content: {
        'application/json': {
          schema: updateHorarioValidation,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Horario actualizado exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z
              .string()
              .openapi({ example: 'Horario actualizado exitosamente' }),
            data: horarioSchema,
          }),
        },
      },
    },
    404: {
      description: 'Horario no encontrado',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: 'Error interno del servidor',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// ==================== DELETE METHODS ====================

// DELETE /api/horario/{id}
horarioRegistry.registerPath({
  method: 'delete',
  path: '/api/horario/{id}',
  description: 'Eliminar un horario por ID',
  summary: 'Eliminar horario',
  tags: ['Horarios'],
  request: {
    params: idParamValidation,
  },
  responses: {
    200: {
      description: 'Horario eliminado exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z
              .string()
              .openapi({ example: 'Horario eliminado exitosamente' }),
          }),
        },
      },
    },
    404: {
      description: 'Horario no encontrado',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: 'Error interno del servidor',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});
