import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import {
  createUsuarioSchema,
  loginSchema,
  usuarioResponseSchema,
  errorResponseSchema,
  findPrestatariosByTipoServicioAndZonaParamsSchema,
  findPrestatariosByTipoServicioAndZonaQuerySchema,
  findPrestatariosByTipoServicioAndZonaResponseSchema,
  notFoundResponseSchema,
  findAllUsuariosResponseSchema,
} from '../usuario/usuario.schemas.js';
import { z } from 'zod';

// Create the usuarioRegistry
export const usuarioRegistry = new OpenAPIRegistry();

// At the top, create schema constants for reuse
const recuperarContrasenaSchema = z.object({
  mail: z.string().email().openapi({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@gmail.com',
  }),
});

const validarCodigoSchema = z.object({
  mail: z.string().email().openapi({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@gmail.com',
  }),
  codigo: z.string().openapi({
    description: 'Código de recuperación de 6 dígitos',
    example: '123456',
  }),
});

const cambiarPasswordSchema = z.object({
  mail: z.string().email().openapi({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@gmail.com',
  }),
  codigo: z.string().openapi({
    description: 'Código de recuperación de 6 dígitos',
    example: '123456',
  }),
  nuevaContrasena: z.string().min(6).openapi({
    description: 'Nueva contraseña (mínimo 6 caracteres)',
    example: 'NuevaPassword123',
  }),
});

const successMessageSchema = z.object({
  message: z.string().openapi({
    description: 'Mensaje de éxito',
    example: 'Operación completada exitosamente',
  }),
});

const userIdParamSchema = z.object({
  userId: z.string().regex(/^\d+$/, 'ID debe ser un número').openapi({
    description: 'ID numérico del usuario',
    example: '1',
  }),
});

const fileUploadSchema = z.object({
  profileImage: z.instanceof(File).openapi({
    type: 'string',
    format: 'binary',
    description: 'Archivo de imagen para el perfil del usuario',
  }),
});

const imageUploadResponseSchema = z.object({
  message: z.string().openapi({
    example: 'Foto de perfil actualizada correctamente',
  }),
  imageUrl: z.string().url().openapi({
    description: 'URL de la imagen subida',
    example: 'http://localhost:3000/uploads/profiles/usuario1.jpg',
  }),
  user: z.object({
    id: z.number(),
    foto: z.string().url().nullable(),
  }),
});

// Register schemas
usuarioRegistry.register('CreateUsuario', createUsuarioSchema);
usuarioRegistry.register('LoginUsuario', loginSchema);
usuarioRegistry.register('UsuarioResponse', usuarioResponseSchema);
usuarioRegistry.register('ErrorResponse', errorResponseSchema);
usuarioRegistry.register(
  'FindPrestatarioByTipoServicioAndZona',
  findPrestatariosByTipoServicioAndZonaResponseSchema
);
usuarioRegistry.register('FindAllUsuarios', findAllUsuariosResponseSchema);
usuarioRegistry.register('NotFoundResponse', notFoundResponseSchema);

// Recovery schemas
usuarioRegistry.register('RecuperarContrasena', recuperarContrasenaSchema);
usuarioRegistry.register('ValidarCodigo', validarCodigoSchema);
usuarioRegistry.register('CambiarPassword', cambiarPasswordSchema);

// Parameter schemas
usuarioRegistry.register(
  'IdParam',
  z.object({
    id: z.string().regex(/^\d+$/, 'ID debe ser un número').openapi({
      description: 'ID numérico del usuario',
      example: '1',
    }),
  })
);

usuarioRegistry.register(
  'UserIdParam',
  z.object({
    userId: z.string().regex(/^\d+$/, 'ID debe ser un número').openapi({
      description: 'ID numérico del usuario',
      example: '1',
    }),
  })
);

// Query schemas
usuarioRegistry.register(
  'PaginationQuery',
  z.object({
    maxItems: z.coerce.number().min(1).max(50).default(5).optional().openapi({
      description: 'Número máximo de elementos por página',
      example: 5,
    }),
    page: z.coerce.number().min(1).default(1).optional().openapi({
      description: 'Número de página',
      example: 1,
    }),
    orderBy: z.string().optional().openapi({
      description: 'Campo por el cual ordenar los resultados',
      example: 'nombre',
    }),
  })
);

// File upload schema
usuarioRegistry.register(
  'FileUpload',
  z.object({
    profileImage: z.instanceof(File).openapi({
      type: 'string',
      format: 'binary',
      description: 'Archivo de imagen para el perfil del usuario',
    }),
  })
);

// Success response schemas
usuarioRegistry.register(
  'SuccessMessage',
  z.object({
    message: z.string().openapi({
      description: 'Mensaje de éxito',
      example: 'Operación completada exitosamente',
    }),
  })
);

usuarioRegistry.register(
  'LoginResponse',
  z.object({
    message: z.string().openapi({ example: 'Login exitoso' }),
    token: z.string().openapi({
      description: 'JWT token para autenticación',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    data: usuarioResponseSchema,
  })
);

usuarioRegistry.register(
  'ImageUploadResponse',
  z.object({
    message: z.string().openapi({
      example: 'Foto de perfil actualizada correctamente',
    }),
    imageUrl: z.string().url().openapi({
      description: 'URL de la imagen subida',
      example: 'http://localhost:3000/uploads/profiles/usuario1.jpg',
    }),
    user: z.object({
      id: z.number(),
      foto: z.string().url().nullable(),
    }),
  })
);

usuarioRegistry.register(
  'CommentsResponse',
  z.object({
    message: z.string().openapi({ example: 'Comentarios encontrados' }),
    data: z.array(
      z.object({
        id: z.number(),
        comentario: z.string(),
        calificacion: z.number().min(1).max(5),
        fechaCreacion: z.string().datetime(),
        cliente: z.object({
          id: z.number(),
          nombre: z.string(),
          apellido: z.string(),
        }),
      })
    ),
    pagination: z.object({
      page: z.number(),
      maxItems: z.number(),
      totalComments: z.number(),
      totalPages: z.number(),
    }),
    average: z.number().openapi({
      description: 'Calificación promedio',
      example: 4.2,
    }),
  })
);

// Conflict error schema (for update operations)
usuarioRegistry.register(
  'ConflictResponse',
  z.object({
    error: z.string().openapi({
      description: 'Código del error de conflicto',
      example: 'EMAIL_ALREADY_EXISTS',
    }),
    message: z.string().openapi({
      description: 'Descripción del error',
      example: 'El mail ya está registrado por otro usuario',
    }),
  })
);

// ==================== POST METHODS ====================

//*Check - POST /api/usuario
usuarioRegistry.registerPath({
  method: 'post',
  path: '/api/usuario',
  description: 'Crear un nuevo usuario',
  summary: 'Crear usuario',
  tags: ['Usuarios'],
  request: {
    body: {
      description: 'Datos del usuario a crear',
      content: {
        'application/json': {
          schema: createUsuarioSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Usuario creado exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z
              .string()
              .openapi({ example: 'Usuario creado exitosamente' }),
            data: usuarioResponseSchema,
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

//*Check - POST /api/usuario/recuperar
usuarioRegistry.registerPath({
  method: 'post',
  path: '/api/usuario/recuperar',
  description: 'Recuperar contraseña de usuario',
  summary: 'Recuperar contraseña',
  tags: ['Autenticación'],
  request: {
    body: {
      description: 'Correo electrónico para recuperación de contraseña',
      content: {
        'application/json': {
          schema: recuperarContrasenaSchema, // ✅ Direct reference
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Correo de recuperación enviado',
      content: {
        'application/json': {
          schema: successMessageSchema, // ✅ Direct reference
        },
      },
    },
    404: {
      description: 'Usuario no encontrado',
      content: {
        'application/json': {
          schema: errorResponseSchema, // ✅ Direct reference
        },
      },
    },
    500: {
      description: 'Error interno del servidor',
      content: {
        'application/json': {
          schema: errorResponseSchema, // ✅ Direct reference
        },
      },
    },
  },
});

//*Check - POST /api/usuario/validar-codigo
usuarioRegistry.registerPath({
  method: 'post',
  path: '/api/usuario/validar-codigo',
  description: 'Validar código de recuperación de contraseña',
  summary: 'Validar código de recuperación',
  tags: ['Autenticación'],
  request: {
    body: {
      description: 'Código de recuperación y correo electrónico',
      content: {
        'application/json': {
          schema: validarCodigoSchema, // ✅ Direct reference
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Código de recuperación válido',
      content: {
        'application/json': {
          schema: successMessageSchema, // ✅ Direct reference
        },
      },
    },
    400: {
      description: 'Código inválido o expirado',
      content: {
        'application/json': {
          schema: errorResponseSchema, // ✅ Direct reference
        },
      },
    },
    500: {
      description: 'Error interno del servidor',
      content: {
        'application/json': {
          schema: errorResponseSchema, // ✅ Direct reference
        },
      },
    },
  },
});

// NEW - POST /api/usuario/cambiar-password
usuarioRegistry.registerPath({
  method: 'post',
  path: '/api/usuario/cambiar-password',
  description: 'Cambiar contraseña usando código de recuperación',
  summary: 'Cambiar contraseña',
  tags: ['Autenticación'],
  request: {
    body: {
      description: 'Datos para cambiar la contraseña',
      content: {
        'application/json': {
          schema: cambiarPasswordSchema, // ✅ Direct reference
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Contraseña cambiada exitosamente',
      content: {
        'application/json': {
          schema: successMessageSchema, // ✅ Direct reference
        },
      },
    },
    400: {
      description: 'Código inválido o expirado',
      content: {
        'application/json': {
          schema: errorResponseSchema, // ✅ Direct reference
        },
      },
    },
    500: {
      description: 'Error interno del servidor',
      content: {
        'application/json': {
          schema: errorResponseSchema, // ✅ Direct reference
        },
      },
    },
  },
});

//*Check - POST /api/usuario/upload-profile-image/{userId}
usuarioRegistry.registerPath({
  method: 'post',
  path: '/api/usuario/upload-profile-image/{userId}',
  description: 'Subir imagen de perfil para un usuario',
  summary: 'Subir imagen de perfil',
  tags: ['Usuarios'],
  request: {
    params: userIdParamSchema, // ✅ Direct reference
    body: {
      description: 'Archivo de imagen a subir',
      content: {
        'multipart/form-data': {
          schema: fileUploadSchema, // ✅ Direct reference
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Imagen de perfil subida exitosamente',
      content: {
        'application/json': {
          schema: imageUploadResponseSchema, // ✅ Direct reference
        },
      },
    },
    400: {
      description: 'Solicitud inválida',
      content: {
        'application/json': {
          schema: errorResponseSchema, // ✅ Direct reference
        },
      },
    },
    500: {
      description: 'Error interno del servidor',
      content: {
        'application/json': {
          schema: errorResponseSchema, // ✅ Direct reference
        },
      },
    },
  },
});

// ==================== GET METHODS ====================

//*Check - GET /api/usuario/login
usuarioRegistry.registerPath({
  method: 'get',
  path: '/api/usuario/login',
  description: 'Iniciar sesión de usuario',
  summary: 'Login de usuario',
  tags: ['Autenticación'],
  request: {
    query: loginSchema,
  },
  responses: {
    200: {
      description: 'Login exitoso',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Login exitoso' }),
            token: z
              .string()
              .openapi({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
            data: usuarioResponseSchema.pick({
              id: true,
              mail: true,
              nombre: true,
              apellido: true,
            }),
          }),
        },
      },
    },
    400: {
      description: 'Faltan datos de login',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    401: {
      description: 'Credenciales inválidas',
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

//*Check - GET /api/usuario
usuarioRegistry.registerPath({
  method: 'get',
  path: '/api/usuario',
  description: 'Obtener todos los usuarios',
  summary: 'Listar usuarios completos',
  tags: ['Usuarios'],
  responses: {
    200: {
      description:
        'Lista de usuarios con turnos, servicios, tipos de servicio, horarios y tareas',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'found all Usuarios' }),
            data: z.array(findAllUsuariosResponseSchema),
          }),
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

//*Check - GET /api/usuario/{id}
usuarioRegistry.registerPath({
  method: 'get',
  path: '/api/usuario/{id}',
  description: 'Obtener un usuario por ID pero con todas sus relaciones',
  summary: 'Trae un usuario y toda su información',
  tags: ['Usuarios'],
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/, 'ID debe ser un número').openapi({
        description: 'ID del usuario',
        example: '1',
      }),
    }),
  },
  responses: {
    200: {
      description: 'Usuario encontrado',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'found one usuario' }),
            data: findAllUsuariosResponseSchema,
          }),
        },
      },
    },
    404: {
      description: 'Usuario no encontrado',
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

//*Check - GET /api/usuario/onlyInfo/{id}
usuarioRegistry.registerPath({
  method: 'get',
  path: '/api/usuario/onlyInfo/{id}',
  description: 'Obtener un usuario por ID sin relaciones',
  summary: 'Obtener usuario básico',
  tags: ['Usuarios'],
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/, 'ID debe ser un número').openapi({
        description: 'ID del usuario',
        example: '1',
      }),
    }),
  },
  responses: {
    200: {
      description: 'Usuario encontrado',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'found one usuario' }),
            data: usuarioResponseSchema,
          }),
        },
      },
    },
    404: {
      description: 'Usuario no encontrado',
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

//*Check - GET /api/usuario/cookie
usuarioRegistry.registerPath({
  method: 'get',
  path: '/api/usuario/cookie',
  description: 'Obtener el usuario autenticado mediante el token JWT',
  summary: 'Obtener usuario por token',
  tags: ['Usuarios'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Usuario encontrado exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({
              example: 'found one usuario',
              description: 'Mensaje de confirmación',
            }),
            data: usuarioResponseSchema,
          }),
        },
      },
    },
    400: {
      description: 'Usuario no autenticado o token inválido',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    401: {
      description: 'Token no proporcionado o inválido',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    404: {
      description: 'Usuario no encontrado',
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

// NEW - GET /api/usuario/comments/{userId}
usuarioRegistry.registerPath({
  method: 'get',
  path: '/api/usuario/comments/{userId}',
  description: 'Obtener comentarios de un usuario específico',
  summary: 'Obtener comentarios por ID de usuario',
  tags: ['Usuarios'],
  request: {
    params: z.object({
      userId: z.string().regex(/^\d+$/, 'ID debe ser un número').openapi({
        description: 'ID del usuario',
        example: '1',
      }),
    }),
    query: z.object({
      maxItems: z.coerce.number().min(1).max(50).default(5).optional().openapi({
        description: 'Número máximo de comentarios por página',
        example: 5,
      }),
      page: z.coerce.number().min(1).default(1).optional().openapi({
        description: 'Número de página',
        example: 1,
      }),
      orderBy: z.string().optional().openapi({
        description: 'Campo por el cual ordenar',
        example: 'fecha',
      }),
    }),
  },
  responses: {
    200: {
      description: 'Comentarios encontrados exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'found comments for user' }),
            data: z.array(
              z.object({
                id: z.number(),
                comentario: z.string(),
                calificacion: z.number().min(1).max(5),
                fechaCreacion: z.string(),
                cliente: z.object({
                  id: z.number(),
                  nombre: z.string(),
                  apellido: z.string(),
                }),
              })
            ),
            pagination: z.object({
              page: z.number(),
              maxItems: z.number(),
              totalComments: z.number(),
              totalPages: z.number(),
            }),
            average: z.number().openapi({ example: 4.2 }),
          }),
        },
      },
    },
    404: {
      description: 'Usuario no encontrado o sin comentarios',
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

//*Check - GET /api/usuarios/prestatarios/{tipoServicio}/{tarea}/{zona}/{orderBy}
usuarioRegistry.registerPath({
  method: 'get',
  path: '/api/usuario/prestatarios/{tipoServicio}/{tarea}/{zona}/{orderBy}',
  tags: ['Usuarios'],
  summary: 'Buscar prestatarios por tipo de servicio, zona y tarea',
  description:
    'Busca prestatarios filtrados por tipo de servicio, zona y tarea específica con paginación',
  request: {
    params: findPrestatariosByTipoServicioAndZonaParamsSchema,
    query: findPrestatariosByTipoServicioAndZonaQuerySchema,
  },
  responses: {
    200: {
      description: 'Prestatarios encontrados exitosamente',
      content: {
        'application/json': {
          schema: findPrestatariosByTipoServicioAndZonaResponseSchema,
        },
      },
    },
    404: {
      description:
        'No se encontraron prestatarios con los criterios especificados',
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
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

// NEW - PUT /api/usuario/{id}
usuarioRegistry.registerPath({
  method: 'put',
  path: '/api/usuario/{id}',
  description: 'Actualizar información de un usuario',
  summary: 'Actualizar usuario',
  tags: ['Usuarios'],
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/, 'ID debe ser un número').openapi({
        description: 'ID del usuario',
        example: '1',
      }),
    }),
    body: {
      description: 'Datos del usuario a actualizar',
      content: {
        'application/json': {
          schema: createUsuarioSchema.partial(),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Usuario actualizado exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'updated usuario' }),
            data: usuarioResponseSchema,
          }),
        },
      },
    },
    409: {
      description: 'Conflicto - datos ya existen',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string().openapi({ example: 'EMAIL_ALREADY_EXISTS' }),
            message: z.string().openapi({
              example: 'El mail ya está registrado por otro usuario',
            }),
          }),
        },
      },
    },
    404: {
      description: 'Usuario no encontrado',
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

// NEW - DELETE /api/usuario/{id}
usuarioRegistry.registerPath({
  method: 'delete',
  path: '/api/usuario/{id}',
  description: 'Eliminar un usuario',
  summary: 'Eliminar usuario',
  tags: ['Usuarios'],
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/, 'ID debe ser un número').openapi({
        description: 'ID del usuario a eliminar',
        example: '1',
      }),
    }),
  },
  responses: {
    200: {
      description: 'Usuario eliminado exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'deleted usuario' }),
            data: usuarioResponseSchema,
          }),
        },
      },
    },
    404: {
      description: 'Usuario no encontrado',
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
