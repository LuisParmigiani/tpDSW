// turno.schemas.ts
// Esquemas de validación para Turno, similar a usuario.schemas.ts y zona.schemas.ts

import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
extendZodWithOpenApi(z);

export const TurnoCreateSchema = z.object({
  fecha: z
    .string()
    .describe('Fecha del turno')
    .openapi({ example: '2025-09-30' }),
  hora: z.string().describe('Hora del turno').openapi({ example: '14:00' }),
  usuarioId: z.number().describe('ID del usuario').openapi({ example: 2 }),
  servicioId: z.number().describe('ID del servicio').openapi({ example: 1 }),
  zonaId: z.number().describe('ID de la zona').openapi({ example: 3 }),
});

export const TurnoUpdateSchema = TurnoCreateSchema.partial();

export const TurnoIdSchema = z.object({
  id: z.number().describe('ID del turno').openapi({ example: 1 }),
});

export const TurnoResponseSchema = z.object({
  id: z.number().describe('ID del turno').openapi({ example: 1 }),
  fecha: z
    .string()
    .describe('Fecha del turno')
    .openapi({ example: '2025-09-30' }),
  hora: z.string().describe('Hora del turno').openapi({ example: '14:00' }),
  usuarioId: z.number().describe('ID del usuario').openapi({ example: 2 }),
  servicioId: z.number().describe('ID del servicio').openapi({ example: 1 }),
  zonaId: z.number().describe('ID de la zona').openapi({ example: 3 }),
});

export const TurnoApiResponseSchema = z.object({
  message: z
    .string()
    .describe('Mensaje de respuesta')
    .openapi({ example: 'Turno creado exitosamente' }),
  data: TurnoResponseSchema.describe('Datos del turno creado'),
});

export type TurnoCreate = z.infer<typeof TurnoCreateSchema>;
export type TurnoUpdate = z.infer<typeof TurnoUpdateSchema>;
export type TurnoId = z.infer<typeof TurnoIdSchema>;
export type TurnoResponse = z.infer<typeof TurnoResponseSchema>;
export type TurnoApiResponse = z.infer<typeof TurnoApiResponseSchema>;
