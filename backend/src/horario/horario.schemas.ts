import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// Extend Zod with OpenAPI functionality
extendZodWithOpenApi(z);

// ==================== CONSTANTES ====================
const ERROR_MESSAGES = {
  diaSemana: {
    min: 'El día de la semana no puede ser menor que 0 (Lunes)',
    max: 'El día de la semana no puede ser mayor que 6 (Domingo)',
  },
  hora: {
    formato: 'La hora debe estar en formato HH:mm:ss',
    rango: 'La hora de inicio debe ser menor que la hora de fin',
  },
  usuario: 'El ID del usuario debe ser un número entero positivo',
  id: 'El ID debe ser un número entero positivo',
};

// ==================== SCHEMAS ====================
export const usuarioSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder los 50 caracteres')
    .regex(
      /^[a-zA-ZÀ-ÿ\s]+$/,
      'El nombre solo puede contener letras y espacios'
    )
    .describe('Nombre del usuario')
    .openapi({
      example: 'Juan',
    }),
  apellido: z
    .string()
    .min(1, 'El apellido es obligatorio')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder los 50 caracteres')
    .regex(
      /^[a-zA-ZÀ-ÿ\s]+$/,
      'El apellido solo puede contener letras y espacios'
    )
    .describe('Apellido del usuario')
    .openapi({
      example: 'Pérez',
    }),
  mail: z
    .string()
    .email('El email debe tener un formato válido')
    .max(100, 'El email no puede exceder los 100 caracteres')
    .describe('Correo electrónico del usuario')
    .openapi({
      example: 'juan.perez@gmail.com',
    }),
  tipoDoc: z
    .enum(['DNI', 'CUIT', 'CUIL'], {
      message: 'Tipo de documento debe ser DNI, CUIT o CUIL',
    })
    .describe('Tipo de documento')
    .openapi({
      example: 'DNI',
    }),
  numeroDoc: z
    .string()
    .min(7, 'Número de documento debe tener al menos 7 caracteres')
    .max(13, 'Número de documento no puede exceder 13 caracteres')
    .regex(
      /^[0-9\-]+$/,
      'Número de documento solo puede contener números y guiones'
    )
    .describe('Número de documento')
    .openapi({
      example: '12345678',
    }),
  telefono: z
    .string()
    .regex(/^[+]?[0-9\s\-()]{8,20}$/, 'Formato de teléfono inválido')
    .describe('Número de teléfono')
    .openapi({
      example: '+54 11 1234-5678',
    }),
  direccion: z
    .string()
    .min(5, 'Dirección debe ser más específica')
    .max(200, 'Dirección no puede exceder 200 caracteres')
    .describe('Dirección del usuario')
    .openapi({
      example: 'Av. Corrientes 1234',
    }),
  foto: z
    .string()
    .url('La foto debe ser una URL válida')
    .max(200, 'La URL de la foto no puede exceder los 200 caracteres')
    .optional()
    .describe('URL de la foto de perfil del usuario')
    .openapi({
      example: 'http://example.com/foto.jpg',
    }),
  estado: z
    .enum(['activo', 'inactivo'], {
      message: 'El estado debe ser "activo" o "inactivo"',
    })
    .default('activo')
    .describe('Estado del usuario')
    .openapi({
      example: 'activo',
    }),
  nombreFantasia: z
    .string()
    .min(2, 'El nombre de fantasía debe tener al menos 2 caracteres')
    .max(30, 'El nombre de fantasía no puede exceder los 30 caracteres')
    .optional()
    .or(z.literal('').transform(() => undefined))
    .describe('Nombre de fantasía del prestatario')
    .openapi({
      example: 'Servicios SRL',
    }),

  descripcion: z
    .string()
    .optional()
    .or(z.literal('').transform(() => undefined))
    .describe('Descripción del prestatario')
    .openapi({
      example: 'Ofrecemos servicios de plomería y electricidad.',
    }),
});

// Esquema para validar horarios
const horarioBaseSchema = z.object({
  diaSemana: z
    .number()
    .int()
    .min(0, ERROR_MESSAGES.diaSemana.min)
    .max(6, ERROR_MESSAGES.diaSemana.max)
    .describe('Día de la semana (0-6, donde 0 es Lunes y 6 es Domingo)')
    .openapi({ example: 0 }),

  horaDesde: z
    .string()
    .regex(
      /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
      ERROR_MESSAGES.hora.formato
    )
    .describe('Hora de inicio en formato HH:mm:ss')
    .openapi({ example: '08:00:00' }),

  horaHasta: z
    .string()
    .regex(
      /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
      ERROR_MESSAGES.hora.formato
    )
    .describe('Hora de fin en formato HH:mm:ss')
    .openapi({ example: '17:00:00' }),

  usuario: usuarioSchema,
});

export const horarioSchema = horarioBaseSchema.refine(
  (data) => data.horaDesde < data.horaHasta,
  {
    message: ERROR_MESSAGES.hora.rango,
    path: ['horaDesde', 'horaHasta'],
  }
);

// Esquema para crear un nuevo horario
export const createHorarioValidation = horarioSchema.openapi({
  title: 'CrearHorario',
  description: 'Esquema para crear un nuevo horario',
});

// Esquema para validar el parámetro ID
export const idParamValidation = z.object({
  id: z.string().regex(/^\d+$/, ERROR_MESSAGES.id),
});

// Esquema para actualizar un horario existente
export const updateHorarioValidation = horarioBaseSchema.partial().openapi({
  title: 'ActualizarHorario',
  description: 'Esquema para actualizar un horario existente',
});
export const errorResponseSchema = z
  .object({
    message: z
      .string()
      .describe('Mensaje de error')
      .openapi({ example: 'El horario no fue encontrado' }),
    errors: z
      .array(
        z.object({
          field: z
            .string()
            .describe('Campo que falló')
            .openapi({ example: 'id' }),
          message: z
            .string()
            .describe('Mensaje de error')
            .openapi({ example: 'id inválido' }),
        })
      )
      .optional()
      .describe('Lista de errores de validación'),
  })
  .openapi({
    title: 'Error',
    description: 'Esquema para representar un error',
  });
