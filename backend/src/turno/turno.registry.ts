import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import {
  TurnoCreateSchema,
  TurnoResponseSchema,
  TurnoApiResponseSchema,
} from './turno.schemas.js';
extendZodWithOpenApi(z);

export const turnoRegistry = new OpenAPIRegistry();

turnoRegistry.register('CreateTurno', TurnoCreateSchema);
turnoRegistry.register('TurnoResponse', TurnoResponseSchema);
turnoRegistry.register('TurnoApiResponse', TurnoApiResponseSchema);

// POST /api/turno
turnoRegistry.registerPath({
  method: 'post',
  path: '/api/turno',
  description: 'Crear un nuevo turno',
  summary: 'Crear turno',
  tags: ['Turnos'],
  request: {
    body: {
      description: 'Datos del turno a crear',
      content: {
        'application/json': {
          schema: TurnoCreateSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Turno creado exitosamente',
      content: {
        'application/json': {
          schema: TurnoApiResponseSchema,
          examples: {
            ejemploExitoso: {
              summary: 'Ejemplo de respuesta exitosa',
              value: {
                message: 'Turno creado exitosamente',
                data: {
                  id: 1,
                  fecha: '2025-09-30',
                  hora: '14:00',
                  usuarioId: 2,
                  servicioId: 1,
                  zonaId: 3,
                },
              },
            },
          },
        },
      },
    },
    400: {
      description: 'Error de validación',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
});

// GET /api/turno
turnoRegistry.registerPath({
  method: 'get',
  path: '/api/turno',
  description: 'Obtener todos los turnos',
  summary: 'Listar turnos',
  tags: ['Turnos'],
  responses: {
    200: {
      description: 'Lista de turnos',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            data: z.array(TurnoResponseSchema),
          }),
          examples: {
            ejemploLista: {
              summary: 'Ejemplo de lista de turnos',
              value: {
                message: 'Turnos encontrados',
                data: [
                  {
                    id: 1,
                    fecha: '2025-09-30',
                    hora: '14:00',
                    usuarioId: 2,
                    servicioId: 1,
                    zonaId: 3,
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
});

// GET /api/turno/{id}
turnoRegistry.registerPath({
  method: 'get',
  path: '/api/turno/{id}',
  description: 'Obtener un turno por ID',
  summary: 'Obtener turno',
  tags: ['Turnos'],
  request: {
    params: z.object({ id: z.string().regex(/^\d+$/) }),
  },
  responses: {
    200: {
      description: 'Turno encontrado',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            data: TurnoResponseSchema,
          }),
          examples: {
            ejemploEncontrado: {
              summary: 'Ejemplo de turno encontrado',
              value: {
                message: 'Turno encontrado',
                data: {
                  id: 1,
                  fecha: '2025-09-30',
                  hora: '14:00',
                  usuarioId: 2,
                  servicioId: 1,
                  zonaId: 3,
                },
              },
            },
          },
        },
      },
    },
    404: {
      description: 'Turno no encontrado',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Turno no encontrado' }),
          }),
        },
      },
    },
  },
});

// PUT /api/turno/{id}
turnoRegistry.registerPath({
  method: 'put',
  path: '/api/turno/{id}',
  description: 'Actualizar un turno por ID',
  summary: 'Actualizar turno',
  tags: ['Turnos'],
  request: {
    params: z.object({ id: z.string().regex(/^\d+$/) }),
    body: {
      description: 'Datos del turno a actualizar',
      content: {
        'application/json': {
          schema: TurnoCreateSchema.partial(),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Turno actualizado',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            data: TurnoResponseSchema,
          }),
          examples: {
            ejemploActualizado: {
              summary: 'Ejemplo de turno actualizado',
              value: {
                message: 'Turno actualizado',
                data: {
                  id: 1,
                  fecha: '2025-09-30',
                  hora: '14:00',
                  usuarioId: 2,
                  servicioId: 1,
                  zonaId: 3,
                },
              },
            },
          },
        },
      },
    },
    404: {
      description: 'Turno no encontrado',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Turno no encontrado' }),
          }),
        },
      },
    },
  },
});

// DELETE /api/turno/{id}
turnoRegistry.registerPath({
  method: 'delete',
  path: '/api/turno/{id}',
  description: 'Eliminar un turno por ID',
  summary: 'Eliminar turno',
  tags: ['Turnos'],
  request: {
    params: z.object({ id: z.string().regex(/^\d+$/) }),
  },
  responses: {
    200: {
      description: 'Turno eliminado',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            data: TurnoResponseSchema,
          }),
          examples: {
            ejemploEliminado: {
              summary: 'Ejemplo de turno eliminado',
              value: {
                message: 'Turno eliminado',
                data: {
                  id: 1,
                  fecha: '2025-09-30',
                  hora: '14:00',
                  usuarioId: 2,
                  servicioId: 1,
                  zonaId: 3,
                },
              },
            },
          },
        },
      },
    },
    404: {
      description: 'Turno no encontrado',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Turno no encontrado' }),
          }),
        },
      },
    },
  },
});
