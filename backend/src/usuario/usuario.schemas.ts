import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const usuarioBaseSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder los 50 caracteres')
    .regex(
      /^[a-zA-ZÀ-ÿ\s]+$/,
      'El nombre solo puede contener letras y espacios'
    )
    .openapi({
      description: 'Nombre del usuario',
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
    .openapi({
      description: 'Apellido del usuario',
      example: 'Pérez',
    }),
  mail: z
    .string()
    .email('El email debe tener un formato válido')
    .max(100, 'El email no puede exceder los 100 caracteres')
    .openapi({
      description: 'Correo electrónico del usuario',
      example: 'juan.perez@gmail.com',
    }),
  tipoDoc: z
    .enum(['DNI', 'CUIT', 'CUIL'], {
      message: 'Tipo de documento debe ser DNI, CUIT o CUIL',
    })
    .openapi({
      description: 'Tipo de documento',
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
    .openapi({
      description: 'Número de documento',
      example: '12345678',
    }),
  telefono: z
    .string()
    .regex(/^[+]?[0-9\s\-()]{8,20}$/, 'Formato de teléfono inválido')
    .openapi({
      description: 'Número de teléfono',
      example: '+54 11 1234-5678',
    }),
  direccion: z
    .string()
    .min(5, 'Dirección debe ser más específica')
    .max(200, 'Dirección no puede exceder 200 caracteres')
    .openapi({
      description: 'Dirección del usuario',
      example: 'Av. Corrientes 1234',
    }),
  contrasena: z
    .string()
    .min(
      6,
      'La contraseña debe tener al menos 6 caracteres, una letra mayúscula, una letra minúscula y un número'
    )
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
      'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número'
    ),
  foto: z
    .string()
    .url('La foto debe ser una URL válida')
    .max(200, 'La URL de la foto no puede exceder los 200 caracteres')
    .optional()
    .openapi({
      description: 'URL de la foto de perfil del usuario',
      example: 'http://example.com/foto.jpg',
    }),
  estado: z
    .enum(['activo', 'inactivo'], {
      message: 'El estado debe ser "activo" o "inactivo"',
    })
    .default('activo')
    .openapi({
      description: 'Estado del usuario',
      example: 'activo',
    }),
});

export const createUsuarioSchema = usuarioBaseSchema
  .extend({
    //Campos obligatorios
    mail: usuarioBaseSchema.shape.mail,
    nombre: usuarioBaseSchema.shape.nombre,
    apellido: usuarioBaseSchema.shape.apellido,
    tipoDoc: usuarioBaseSchema.shape.tipoDoc,
    numeroDoc: usuarioBaseSchema.shape.numeroDoc,
    telefono: usuarioBaseSchema.shape.telefono,
    direccion: usuarioBaseSchema.shape.direccion,
    estado: usuarioBaseSchema.shape.estado,
    contrasena: z
      .string()
      .min(
        6,
        'La contraseña debe tener al menos 6 caracteres, una letra mayúscula, una letra minúscula y un número'
      )
      .openapi({
        description: 'Contraseña del usuario',
        example: 'Password123',
      }),
    nombreFantasia: z
      .string()
      .min(2, 'El nombre de fantasía debe tener al menos 2 caracteres')
      .max(30, 'El nombre de fantasía no puede exceder los 30 caracteres')
      .optional()
      .openapi({
        description: 'Nombre de fantasía del prestatario',
        example: 'Servicios SRL',
      }),
    descripcion: z.string().optional().openapi({
      description: 'Descripción del prestatario',
      example: 'Ofrecemos servicios de plomería y electricidad.',
    }),
  })
  .openapi('CreateUsuario');

export const loginSchema = z
  .object({
    mail: z.string().email('El email debe tener un formato válido').openapi({
      description: 'Correo electrónico del usuario',
      example: 'juan.perez@gmail.com',
    }),
    contrasena: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .openapi({
        description: 'Contraseña del usuario',
        example: 'Password123',
      }),
  })
  .openapi('Login');

export const findPrestatariosByTipoServicioAndZonaParamsSchema = z
  .object({
    tipoServicio: z.string().openapi({
      description: 'Tipo de servicio a filtrar ("Todos" para no filtrar)',
      example: 'Plomería',
    }),
    zona: z.string().openapi({
      description: 'Zona a filtrar ("Todas" para no filtrar)',
      example: 'Centro',
    }),
    tarea: z.string().optional().openapi({
      description: 'Tarea específica a filtrar (opcional)',
      example: 'Reparación de canillas',
    }),
    orderBy: z.enum(['nombre', 'calificacion']).optional().openapi({
      description: 'Campo por el cual ordenar los resultados',
      example: 'calificacion',
    }),
  })
  .openapi('FindPrestatariosParams');

export const findPrestatariosByTipoServicioAndZonaQuerySchema = z
  .object({
    maxItems: z.coerce.number().min(1).max(50).default(6).openapi({
      description: 'Número máximo de elementos por página',
      example: 6,
    }),
    page: z.coerce.number().min(1).default(1).openapi({
      description: 'Número de página',
      example: 1,
    }),
  })
  .openapi('FindPrestatariosQuery');

//! Response schemas
//! Response Schemas
// ...existing code...

// Additional schemas for related entities
export const tareaSchema = z
  .object({
    id: z.number().openapi({
      description: 'ID de la tarea',
      example: 1,
    }),
    nombreTarea: z.string().openapi({
      description: 'Nombre de la tarea',
      example: 'Reparación de canillas',
    }),
    descripcionTarea: z.string().openapi({
      description: 'Descripción de la tarea',
      example: 'Arreglo de grifería',
    }),
    duracionTarea: z.number().openapi({
      description: 'Duración de la tarea en minutos',
      example: 60,
    }),
    tipoServicio: z.number().openapi({
      description: 'ID del tipo de servicio',
      example: 2,
    }),
  })
  .openapi('Tarea');

export const servicioSchema = z
  .object({
    id: z.number().openapi({
      description: 'ID del servicio',
      example: 1,
    }),
    descripcionServicio: z.string().optional().openapi({
      description: 'Descripción del servicio',
      example: 'Servicio de plomería profesional',
    }),
    precio: z.number().openapi({
      description: 'Precio del servicio',
      example: 2500.0,
    }),
    estado: z.string().openapi({
      description: 'Estado del servicio',
      example: 'activo',
    }),
    tarea: tareaSchema.openapi({
      description: 'Tarea asociada al servicio',
    }),
  })
  .openapi('Servicio');

export const tipoServicioSchema = z
  .object({
    id: z.number().openapi({
      description: 'ID del tipo de servicio',
      example: 1,
    }),
    nombreTipo: z.string().openapi({
      description: 'Nombre del tipo de servicio',
      example: 'Plomería',
    }),
    descripcionTipo: z.string().openapi({
      description: 'Descripción del tipo de servicio',
      example: 'Servicios de plomería profesional',
    }),
  })
  .openapi('TipoServicio');

export const horarioSchema = z
  .object({
    id: z.number().openapi({
      description: 'ID del horario',
      example: 1,
    }),
    diaSemana: z.string().openapi({
      description: 'Día de la semana',
      example: 'Lunes',
    }),
    horaInicio: z.string().openapi({
      description: 'Hora de inicio',
      example: '09:00',
    }),
    horaFin: z.string().openapi({
      description: 'Hora de fin',
      example: '17:00',
    }),
  })
  .openapi('Horario');

export const turnoSchema = z
  .object({
    id: z.number().openapi({
      description: 'ID del turno',
      example: 1,
    }),
    fechaTurno: z.string().openapi({
      description: 'Fecha del turno',
      example: '2024-03-15',
    }),
    horaTurno: z.string().openapi({
      description: 'Hora del turno',
      example: '14:30',
    }),
    estado: z.string().openapi({
      description: 'Estado del turno',
      example: 'confirmado',
    }),
    calificacion: z.number().nullable().openapi({
      description: 'Calificación del turno (1-5)',
      example: 4.5,
    }),
    comentario: z.string().nullable().openapi({
      description: 'Comentario del cliente',
      example: 'Excelente servicio',
    }),
  })
  .openapi('Turno');

// Complete user response schema with all relationships
export const usuarioCompleteResponseSchema = z
  .object({
    id: z.number().openapi({ description: 'ID único del usuario', example: 1 }),
    mail: z.string().openapi({
      description: 'Email del usuario',
      example: 'usuario@example.com',
    }),
    nombre: z.string().openapi({
      description: 'Nombre del usuario',
      example: 'Juan',
    }),
    apellido: z.string().openapi({
      description: 'Apellido del usuario',
      example: 'Pérez',
    }),
    tipoDoc: z.string().openapi({
      description: 'Tipo de documento',
      example: 'DNI',
    }),
    numeroDoc: z.string().openapi({
      description: 'Número de documento',
      example: '12345678',
    }),
    telefono: z.string().openapi({
      description: 'Teléfono',
      example: '+54 11 1234-5678',
    }),
    direccion: z.string().openapi({
      description: 'Dirección',
      example: 'Av. Corrientes 1234',
    }),
    nombreFantasia: z.string().nullable().openapi({
      description: 'Nombre de fantasía',
      example: 'Plomería Pérez',
    }),
    descripcion: z.string().nullable().openapi({
      description: 'Descripción',
      example: 'Plomero con experiencia',
    }),
    foto: z.string().nullable().openapi({
      description: 'URL de la foto de perfil',
      example: 'http://localhost:3000/uploads/profiles/optimized_1.webp',
    }),
    estado: z.string().openapi({
      description: 'Estado del usuario',
      example: 'activo',
    }),
    turnos: z.array(turnoSchema).openapi({
      description: 'Turnos asociados al usuario',
    }),
    servicios: z.array(servicioSchema).openapi({
      description: 'Servicios ofrecidos por el usuario',
    }),
    tiposDeServicio: z.array(tipoServicioSchema).openapi({
      description: 'Tipos de servicio que ofrece el usuario',
    }),
    horarios: z.array(horarioSchema).openapi({
      description: 'Horarios de disponibilidad del usuario',
    }),
  })
  .openapi('UsuarioCompleteResponse');

// Update the findAll response schema
export const findAllUsuariosResponseSchema = z
  .object({
    message: z.string().openapi({
      description: 'Mensaje de respuesta',
      example: 'found all Usuarios',
    }),
    data: z.array(usuarioCompleteResponseSchema).openapi({
      description: 'Lista completa de usuarios con todas sus relaciones',
    }),
  })
  .openapi('FindAllUsuariosResponse');

export const tareaInfoSchema = z
  .object({
    nombreTarea: z.string().openapi({
      description: 'Nombre de la tarea',
      example: 'Reparación de canillas',
    }),
  })
  .openapi('TareaInfo');

export const tipoServicioInfoSchema = z
  .object({
    id: z.number().openapi({
      description: 'ID del tipo de servicio',
      example: 1,
    }),
    nombreTipo: z.string().openapi({
      description: 'Nombre del tipo de servicio',
      example: 'Plomería',
    }),
    descripcionTipo: z.string().openapi({
      description: 'Descripción del tipo de servicio',
      example: 'Servicios de plomería profesional',
    }),
  })
  .openapi('TipoServicioInfo');

export const zonaInfoSchema = z
  .object({
    id: z.number().openapi({
      description: 'ID de la zona',
      example: 1,
    }),
    descripcion_zona: z.string().openapi({
      description: 'Descripción de la zona',
      example: 'Centro',
    }),
  })
  .openapi('ZonaInfo');

export const prestatarioWithRatingSchema = z
  .object({
    id: z.number().openapi({
      description: 'ID único del prestatario',
      example: 1,
    }),
    nombre: z.string().openapi({
      description: 'Nombre del prestatario',
      example: 'Juan',
    }),
    apellido: z.string().openapi({
      description: 'Apellido del prestatario',
      example: 'Pérez',
    }),
    nombreFantasia: z.string().openapi({
      description: 'Nombre de fantasía del prestatario',
      example: 'Plomería Pérez',
    }),
    descripcion: z.string().nullable().openapi({
      description: 'Descripción del prestatario',
      example: 'Plomero con más de 10 años de experiencia',
    }),
    foto: z.string().nullable().openapi({
      description: 'URL de la foto de perfil',
      example: 'http://localhost:3000/uploads/profiles/optimized_1.webp',
    }),
    tiposDeServicio: z.array(tipoServicioInfoSchema).openapi({
      description: 'Tipos de servicio que ofrece el prestatario',
    }),
    tareas: z.array(tareaInfoSchema).openapi({
      description: 'Tareas específicas que puede realizar',
    }),
    calificacion: z.number().min(0).max(5).openapi({
      description: 'Calificación promedio del prestatario (0-5)',
      example: 4.5,
    }),
  })
  .openapi('PrestatarioWithRating');

export const paginationInfoSchema = z
  .object({
    page: z.number().openapi({
      description: 'Página actual',
      example: 1,
    }),
    maxItems: z.number().openapi({
      description: 'Elementos por página',
      example: 6,
    }),
    totalPages: z.number().openapi({
      description: 'Total de páginas disponibles',
      example: 5,
    }),
  })
  .openapi('PaginationInfo');

export const findPrestatariosByTipoServicioAndZonaResponseSchema = z
  .object({
    message: z.string().openapi({
      description: 'Mensaje de respuesta',
      example: 'found prestatarios',
    }),
    data: z.array(prestatarioWithRatingSchema).openapi({
      description: 'Lista de prestatarios encontrados',
    }),
    pagination: paginationInfoSchema.openapi({
      description: 'Información de paginación',
    }),
  })
  .openapi('FindPrestatariosResponse');

export const notFoundResponseSchema = z
  .object({
    message: z.string().openapi({
      description: 'Mensaje de error cuando no se encuentran prestatarios',
      example: 'No prestatarios found for the given tipoServicio and zona',
    }),
  })
  .openapi('NotFoundResponse');

export const usuarioResponseSchema = z
  .object({
    id: z.number().openapi({ description: 'ID único del usuario', example: 1 }),
    mail: z.string().openapi({
      description: 'Email del usuario',
      example: 'usuario@example.com',
    }),
    nombre: z
      .string()
      .openapi({ description: 'Nombre del usuario', example: 'Juan' }),
    apellido: z
      .string()
      .openapi({ description: 'Apellido del usuario', example: 'Pérez' }),
    tipoDoc: z
      .string()
      .openapi({ description: 'Tipo de documento', example: 'DNI' }),
    numeroDoc: z
      .string()
      .openapi({ description: 'Número de documento', example: '12345678' }),
    telefono: z
      .string()
      .openapi({ description: 'Teléfono', example: '+54 11 1234-5678' }),
    direccion: z
      .string()
      .openapi({ description: 'Dirección', example: 'Av. Corrientes 1234' }),
    nombreFantasia: z.string().nullable().openapi({
      description: 'Nombre de fantasía',
      example: 'Plomería Pérez',
    }),
    descripcion: z.string().nullable().openapi({
      description: 'Descripción',
      example: 'Plomero con experiencia',
    }),
  })
  .openapi('UsuarioResponse');

export const errorResponseSchema = z
  .object({
    message: z.string().openapi({
      description: 'Mensaje de error',
      example: 'Validation failed',
    }),
    errors: z
      .array(
        z.object({
          field: z
            .string()
            .openapi({ description: 'Campo que falló', example: 'email' }),
          message: z.string().openapi({
            description: 'Mensaje de error',
            example: 'Email inválido',
          }),
        })
      )
      .optional()
      .openapi({ description: 'Detalles de errores de validación' }),
  })
  .openapi('ErrorResponse');

//! Exporto los esquemas para usar en el middleware de validación

export const createUsuarioValidation = createUsuarioSchema;
export const updateUsuarioValidation = createUsuarioSchema.partial();
export const loginValidation = loginSchema;

export const recuperarContrasenaValidation = z.object({
  mail: z.string().email('Email inválido'),
});

export const validarCodigoValidation = z.object({
  mail: z.string().email('Email inválido'),
  codigo: z
    .string()
    .min(6, 'El código debe tener 6 dígitos')
    .max(6, 'El código debe tener 6 dígitos'),
});

export const cambiarPasswordValidation = z.object({
  mail: z.string().email('Email inválido'),
  codigo: z
    .string()
    .min(6, 'El código debe tener 6 dígitos')
    .max(6, 'El código debe tener 6 dígitos'),
  nuevaContrasena: z
    .string()
    .min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
});

// Params validations
export const idParamValidation = z.object({
  id: z.string().regex(/^\d+$/, 'ID debe ser un número válido'),
});

export const userIdParamValidation = z.object({
  userId: z.string().regex(/^\d+$/, 'User ID debe ser un número válido'),
});

export const paginationQueryValidation = z.object({
  maxItems: z.coerce.number().min(1).max(50).default(5),
  page: z.coerce.number().min(1).default(1),
  orderBy: z.string().optional(),
});
