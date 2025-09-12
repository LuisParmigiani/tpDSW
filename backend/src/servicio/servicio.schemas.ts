import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// Extend Zod with OpenAPI functionality
extendZodWithOpenApi(z);

// Base servicio schema
export const servicioBaseSchema = z.object({
  descripcionServicio: z
    .preprocess((val) => {
      if (val === '' || val === null) return undefined;
      return val;
    }, z.string().min(10, 'La descripción del servicio debe tener al menos 10 caracteres').max(500, 'La descripción del servicio no puede exceder los 500 caracteres').optional())
    .describe('Descripción detallada del servicio')
    .openapi({
      example: 'Servicio completo de plomería residencial',
    }),

  precio: z
    .number()
    .positive('El precio debe ser un número positivo')
    .max(999999.99, 'El precio no puede exceder $999,999.99')
    .describe('Precio del servicio en pesos argentinos')
    .openapi({
      example: 2500.0,
    }),

  estado: z
    .enum(['activo', 'inactivo', 'suspendido'], {
      message: 'El estado debe ser "activo", "inactivo" o "suspendido"',
    })
    .default('activo')
    .describe('Estado del servicio')
    .openapi({
      example: 'activo',
    }),

  // Foreign key references
  tarea: z
    .number()
    .int('El ID de la tarea debe ser un número entero')
    .positive('El ID de la tarea debe ser positivo')
    .describe('ID de la tarea asociada al servicio')
    .openapi({
      example: 1,
    }),

  usuario: z
    .number()
    .int('El ID del usuario debe ser un número entero')
    .positive('El ID del usuario debe ser positivo')
    .describe('ID del usuario que ofrece el servicio')
    .openapi({
      example: 1,
    }),
});

// Create servicio schema
export const createServicioSchema = servicioBaseSchema.extend({
  // All fields are required for creation
  precio: servicioBaseSchema.shape.precio,
  estado: servicioBaseSchema.shape.estado,
  tarea: servicioBaseSchema.shape.tarea,
  usuario: servicioBaseSchema.shape.usuario,
});

// Update servicio schema (partial for PUT requests)
export const updateServicioSchema = servicioBaseSchema.partial();

// Tarea info schema for responses
export const tareaInfoSchema = z.object({
  id: z.number().describe('ID de la tarea').openapi({
    example: 1,
  }),
  nombreTarea: z.string().describe('Nombre de la tarea').openapi({
    example: 'Reparación de canillas',
  }),
  descripcionTarea: z.string().describe('Descripción de la tarea').openapi({
    example: 'Arreglo y mantenimiento de grifería',
  }),
  duracionTarea: z
    .number()
    .describe('Duración estimada de la tarea en minutos')
    .openapi({
      example: 60,
    }),
  tipoServicio: z
    .object({
      id: z.number(),
      nombreTipo: z.string(),
      descripcionTipo: z.string(),
    })
    .describe('Tipo de servicio asociado a la tarea'),
});

// Usuario info schema for responses
export const usuarioInfoSchema = z.object({
  id: z.number().describe('ID del usuario').openapi({
    example: 1,
  }),
  nombre: z.string().describe('Nombre del usuario').openapi({
    example: 'Juan',
  }),
  apellido: z.string().describe('Apellido del usuario').openapi({
    example: 'Pérez',
  }),
  mail: z.string().describe('Email del usuario').openapi({
    example: 'juan.perez@gmail.com',
  }),
  nombreFantasia: z
    .string()
    .nullable()
    .describe('Nombre de fantasía del prestatario')
    .openapi({
      example: 'Plomería Pérez',
    }),
  telefono: z.string().describe('Teléfono del usuario').openapi({
    example: '+54 11 1234-5678',
  }),
});

// Servicio response schema (basic)
export const servicioResponseSchema = z.object({
  id: z.number().describe('ID único del servicio').openapi({
    example: 1,
  }),
  descripcionServicio: z
    .string()
    .nullable()
    .describe('Descripción del servicio')
    .openapi({
      example: 'Servicio completo de plomería residencial',
    }),
  precio: z.number().describe('Precio del servicio').openapi({
    example: 2500.0,
  }),
  estado: z.string().describe('Estado del servicio').openapi({
    example: 'activo',
  }),
});

// Complete servicio response with relationships
export const servicioCompleteResponseSchema = z.object({
  id: z.number().describe('ID único del servicio').openapi({
    example: 1,
  }),
  descripcionServicio: z
    .string()
    .nullable()
    .describe('Descripción del servicio')
    .openapi({
      example: 'Servicio completo de plomería residencial',
    }),
  precio: z.number().describe('Precio del servicio').openapi({
    example: 2500.0,
  }),
  estado: z.string().describe('Estado del servicio').openapi({
    example: 'activo',
  }),
  tarea: tareaInfoSchema.describe('Información de la tarea asociada'),
  usuario: usuarioInfoSchema.describe(
    'Información del usuario que ofrece el servicio'
  ),
});

// Find all servicios response
export const findAllServiciosResponseSchema = z.object({
  message: z.string().describe('Mensaje de respuesta').openapi({
    example: 'found all Servicios',
  }),
  data: z
    .array(servicioCompleteResponseSchema)
    .describe('Lista completa de servicios con sus relaciones'),
});

// Find servicios by usuario response
export const findServiciosByUsuarioResponseSchema = z.object({
  message: z.string().describe('Mensaje de respuesta').openapi({
    example: 'found servicios for usuario',
  }),
  data: z
    .array(servicioCompleteResponseSchema)
    .describe('Lista de servicios del usuario especificado'),
});

// Error response schema
export const errorResponseSchema = z.object({
  message: z.string().describe('Mensaje de error').openapi({
    example: 'Validation failed',
  }),
  errors: z
    .array(
      z.object({
        field: z.string().describe('Campo que falló').openapi({
          example: 'precio',
        }),
        message: z.string().describe('Mensaje de error').openapi({
          example: 'El precio debe ser un número positivo',
        }),
      })
    )
    .optional()
    .describe('Detalles de errores de validación'),
});

export const upsertServicioSchema = createServicioSchema.extend({
  // precio and usuario are required, tarea is optional for upsert
  usuario: servicioBaseSchema.shape.usuario,
  precio: servicioBaseSchema.shape.precio,
  tarea: servicioBaseSchema.shape.tarea.optional(),
});

export const upsertServicioResponseSchema = z.object({
  message: z.string().describe('Mensaje de respuesta').openapi({
    example: 'Servicio creado o actualizado',
  }),
  data: servicioCompleteResponseSchema.describe(
    'Datos del servicio creado o actualizado'
  ),
  action: z.enum(['created', 'updated']).describe('Acción realizada').openapi({
    example: 'created',
  }),
});

export const userTaskParamsSchema = z.object({
  usuarioId: z.string().describe('ID del usuario').openapi({
    example: '1',
  }),
  tareaId: z.string().describe('ID de la tarea').openapi({
    example: '1',
  }),
});

// Success message schema
export const successMessageSchema = z.object({
  message: z.string().describe('Mensaje de éxito').openapi({
    example: 'Operación completada exitosamente',
  }),
});

// Parameter validation schemas
export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID debe ser un número válido')
    .describe('ID numérico del servicio')
    .openapi({
      example: '1',
    }),
});

export const usuarioIdParamSchema = z.object({
  usuarioId: z
    .string()
    .regex(/^\d+$/, 'Usuario ID debe ser un número válido')
    .describe('ID numérico del usuario')
    .openapi({
      example: '1',
    }),
});

// Query parameters for filtering
export const servicioQuerySchema = z.object({
  estado: z
    .enum(['activo', 'inactivo', 'suspendido'])
    .optional()
    .describe('Filtrar por estado del servicio')
    .openapi({
      example: 'activo',
    }),
  precioMin: z.coerce
    .number()
    .positive()
    .optional()
    .describe('Precio mínimo para filtrar')
    .openapi({
      example: 1000,
    }),
  precioMax: z.coerce
    .number()
    .positive()
    .optional()
    .describe('Precio máximo para filtrar')
    .openapi({
      example: 5000,
    }),
  tareaId: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .describe('Filtrar por ID de tarea específica')
    .openapi({
      example: 1,
    }),
});

// Validation schemas for middleware
export const createServicioValidation = createServicioSchema;
export const updateServicioValidation = updateServicioSchema;
export const idParamValidation = idParamSchema;
export const usuarioIdParamValidation = usuarioIdParamSchema;
export const servicioQueryValidation = servicioQuerySchema;
export const userTaskParamsValidation = userTaskParamsSchema;
export const upsertServicioValidation = upsertServicioSchema;
