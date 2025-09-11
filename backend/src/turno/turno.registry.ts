import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const turnoRegistry = new OpenAPIRegistry();

// Schemas básicos para Turno
export const createTurnoSchema = z.object({
  fecha: z
    .string()
    .describe('Fecha del turno')
    .openapi({ example: '2025-09-30' }),
  hora: z.string().describe('Hora del turno').openapi({ example: '14:00' }),
  usuarioId: z.number().describe('ID del usuario'),
  servicioId: z.number().describe('ID del servicio'),
});

export const turnoResponseSchema = z.object({
  id: z.number().describe('ID del turno'),
  fecha: z.string(),
  hora: z.string(),
  usuarioId: z.number(),
  servicioId: z.number(),
});

turnoRegistry.register('CreateTurno', createTurnoSchema);
turnoRegistry.register('TurnoResponse', turnoResponseSchema);

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
          schema: createTurnoSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Turno creado exitosamente',
      content: {
        'application/json': {
          schema: turnoResponseSchema,
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
            data: z.array(turnoResponseSchema),
          }),
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
            data: turnoResponseSchema,
          }),
        },
      },
    },
    404: {
      description: 'Turno no encontrado',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
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
          schema: createTurnoSchema.partial(),
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
            data: turnoResponseSchema,
          }),
        },
      },
    },
    404: {
      description: 'Turno no encontrado',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
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
            data: turnoResponseSchema,
          }),
        },
      },
    },
    404: {
      description: 'Turno no encontrado',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
});
