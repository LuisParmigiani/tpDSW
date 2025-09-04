import { Request, Response, NextFunction } from 'express';
import { Usuario } from './usuario.entity.js';
import path from 'path';
import { getTurnosByServicioIdHelper } from '../turno/turno.controler.js';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import fsSync from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import { orm } from '../shared/db/orm.js';
import nodemailer from 'nodemailer';
import { processProfileImage } from '../utils/imageProcessor.js';
const __filename = fileURLToPath(import.meta.url);
const em = orm.em;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// Función para detectar si estamos en modo local
const __dirname = path.dirname(__filename);

interface AuthRequest extends Request {
  user?: {
    id: string;
    rol: string;
  };
}

function sanitizeUsuarioInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizeUsuarioInput = {
    mail: req.body.mail,
    contrasena: req.body.contrasena,
    tipoDoc: req.body.tipoDoc,
    numeroDoc: req.body.numeroDoc,
    telefono: req.body.telefono,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    direccion: req.body.direccion,
    nombreFantasia: req.body.nombreFantasia,
    descripcion: req.body.descripcion,
    foto: req.body.foto,
    turnos: req.body.turnos,
    tarea: req.body.tarea,
    servicios: req.body.servicios,
    tiposDeServicio: req.body.tiposDeServicio,
    horarios: req.body.horarios,
    zonas: req.body.zonas,
    orderBy: req.body.orderBy,
    maxItems: req.body.maxItems,
    page: req.body.page,
  };
  Object.keys(req.body.sanitizeUsuarioInput).forEach((key) => {
    if (req.body.sanitizeUsuarioInput[key] === undefined) {
      delete req.body.sanitizeUsuarioInput[key];
    }
  });
  next();
}
type PrestatarioWithRating = {
  id: number;
  nombre: string;
  apellido: string;
  nombreFantasia: string;
  tiposDeServicio: Array<{
    id: number;
    nombreTipo: string;
    descripcionTipo: string;
  }>;
  zonas: Array<{ id: number; descripcionZona: string }>;
  calificacion: number;
};

async function findAll(req: Request, res: Response) {
  try {
    const users = await em.find(
      Usuario,
      {},
      {
        populate: [
          'turnos',
          'servicios',
          'tiposDeServicio',
          'horarios',
          'servicios.tarea',
        ],
      }
    );
    res.status(200).json({ message: 'found all Usuarios', data: users });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findPrestatariosByTipoServicioAndZona(
  req: Request,
  res: Response
) {
  try {
    const nombreTipoServicio = req.params.tipoServicio;
    const nombreZona = req.params.zona;
    const tarea = req.params.tarea;
    const orderBy = req.params.orderBy as string;
    const maxItems = Number(req.query.maxItems) || 6;
    const page = Number(req.query.page) || 1;
    const offset = (page - 1) * maxItems;
    let filtroTipoServicio = '';
    if (nombreTipoServicio !== 'Todos') {
      filtroTipoServicio = nombreTipoServicio;
    }
    let filtroTarea = '';
    if (tarea && tarea.trim() !== '' && tarea !== undefined) {
      filtroTarea = tarea;
    }
    let filtroZona = '';
    if (nombreZona !== 'Todas') {
      filtroZona = nombreZona;
    }

    // Build the where clause conditionally
    const whereClause: any = {};
    whereClause.nombreFantasia = { $ne: null }; // De esta manera no traemos ningún usuario que no
    if (filtroTipoServicio) {
      whereClause.tiposDeServicio = { nombreTipo: filtroTipoServicio };
    }
    if (filtroTarea) {
      whereClause.servicios = {
        tarea: { nombreTarea: filtroTarea },
      };
    }
    if (filtroZona) {
      whereClause.zonas = { descripcion_zona: filtroZona };
    }
    //! Por un tema de performance se tendría que calcular y guardar en algún lado la calificación, apra no tener que calcular todas las calificaciones
    //! y ordenar 30 objetos cada vez que se llama
    const [prestatarios, total] = await em.findAndCount(Usuario, whereClause, {
      populate: [
        'tiposDeServicio',
        'zonas',
        'servicios',
        'servicios.turnos',
        'servicios.tarea',
      ],
      //Pasar order by después.
    });

    if (total === 0) {
      return res.status(404).json({
        message: 'No prestatarios found for the given tipoServicio and zona',
      });
    }

    // Transform Usuario entities to PrestatarioWithRating
    const prestatariosWithRating = prestatarios.map((prest) => {
      let totalCalificaciones = 0;
      let countCalificaciones = 0;

      const servicios = prest.servicios.getItems();
      const tareas: {
        nombreTarea: string;
      }[] = [];
      //Armo una colección de tareas del prestatario, le saque los atributos que no me servían
      servicios.forEach((s) => {
        tareas.push({
          nombreTarea: s.tarea.nombreTarea,
        });
      });
      for (const servicio of servicios) {
        if (servicio.turnos !== null && servicio.turnos !== undefined) {
          const turnos = servicio.turnos;
          for (const turno of turnos) {
            if (
              turno.calificacion !== null &&
              turno.calificacion !== undefined
            ) {
              totalCalificaciones += turno.calificacion;
              countCalificaciones++;
            }
          }
        }
      }
      // Build a plain object with all needed properties
      /*       "tarea": {
            "id": 11,
            "nombreTarea": "Reparación de canillas",
            "descripcionTarea": "Arreglo de grifería",
            "duracionTarea": 60,
            "tipoServicio": 2
          }, */
      return {
        id: prest.id,
        nombre: prest.nombre,
        apellido: prest.apellido,
        nombreFantasia: prest.nombreFantasia,
        descripcion: prest.descripcion,
        foto: prest.foto,
        tiposDeServicio: prest.tiposDeServicio.getItems(),
        tareas: tareas,
        calificacion:
          countCalificaciones > 0
            ? totalCalificaciones / countCalificaciones
            : 0,
      };
    });

    // Apply ordering if specified
    //Se que es una mala práctica utilizar un any type pero sino era batante dificil hacer que typescript no se queje
    if (orderBy) {
      prestatariosWithRating.sort((a, b) => {
        switch (orderBy) {
          case 'nombre':
            return (a as any).nombreFantasia.localeCompare(b.nombreFantasia);
          case 'calificacion':
            return (b.calificacion || 0) - (a.calificacion || 0); // Descending
          default:
            return (a as any).nombreFantasia.localeCompare(b.nombreFantasia);
        }
      });
    }
    // Paginación manual
    const totalPages = Math.ceil(total / maxItems);
    const start = (page - 1) * maxItems;
    const end = start + maxItems;
    const pageItems = prestatariosWithRating.slice(start, end);
    res.status(200).json({
      message: 'found prestatarios',
      data: pageItems,
      pagination: {
        page,
        maxItems,
        totalPages,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
async function findOneOnlyInfo(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const user = await em.findOneOrFail(Usuario, { id }, {});
    res.status(200).json({ message: 'found one usuario', data: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const user = await em.findOneOrFail(
      Usuario,
      { id },
      {
        populate: [
          'turnos',
          'servicios',
          'servicios.tarea',
          'servicios.tarea.tipoServicio',
          'tiposDeServicio',
          'horarios',
        ],
      }
    );
    res.status(200).json({ message: 'found one usuario', data: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOneByCookie(req: AuthRequest, res: Response) {
  try {
    // Si el id viene por params, úsalo. Si no, usa el id del usuario autenticado.
    const id = req.user?.id;
    console.log('ID from token:', id);
    if (!id) {
      return res.status(400).json({ message: 'Usuario no autenticado' });
    }

    const user = await em.findOneOrFail(Usuario, { id: Number(id) }, {});
    res.status(200).json({ message: 'found one usuario', data: user });
  } catch (error: any) {
    res.status(500).json({
      message: 'entro al catch de findOneByCookie',
      error: error.message,
    });
  }
}

async function add(req: Request, res: Response) {
  try {
    // encripta password
    if (req.body.sanitizeUsuarioInput.contrasena) {
      const hashedPassword = await bcrypt.hash(
        req.body.sanitizeUsuarioInput.contrasena,
        10
      );
      req.body.sanitizeUsuarioInput.contrasena = hashedPassword;
    }
    const newUser = em.create(Usuario, req.body.sanitizeUsuarioInput);
    await em.flush();
    res.status(201).json({ message: 'created new usuario', data: newUser });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
    console.error(error); // agrego para ver el error en el
  }
}
async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const updateUser = await em.findOneOrFail(Usuario, { id });
    em.assign(updateUser, req.body.sanitizeUsuarioInput);
    await em.flush();
    res.status(200).json({ message: 'updated usuario', data: updateUser });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const user = await em.findOneOrFail(Usuario, { id });
    await em.removeAndFlush(user);
    res.status(200).json({ message: 'deleted usuario', data: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function getCommentsByUserId(req: Request, res: Response) {
  try {
    const maxItems = Number(req.query.maxItems) || 5;
    const page = Number(req.query.page) || 1;
    const orderBy = req.query.orderBy || '';
    const userId = Number.parseInt(req.params.id);

    // conseguir todos los servicios del usuario para ver los turnos
    const userWithServices = await em.findOne(
      Usuario,
      { id: userId },
      { populate: ['servicios'] }
    );

    if (!userWithServices?.servicios?.length) {
      return res
        .status(404)
        .json({ message: 'Usuario no encontrado o sin servicios' });
    }

    // Obtener los IDs de cada servicio del usuario
    const idServices = userWithServices.servicios.map(
      (servicio: any) => servicio.id
    );

    // conseguir todos los comentarios de todos los servicios del usuario
    const commentsData = await getTurnosByServicioIdHelper({
      idServices,
      maxItems,
      page,
      orderBy,
    });

    res.status(200).json({
      message: 'Comentarios encontrados',
      data: commentsData.comments,
      pagination: {
        page,
        maxItems,
        totalComments: commentsData.totalComments,
        totalPages: commentsData.totalPages,
      },
      average: commentsData.average,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function loginUsuario(req: Request, res: Response) {
  try {
    const mail = req.query.mail as string;
    const contrasena = req.query.contrasena as string;
    if (!mail || !contrasena) {
      return res.status(400).json();
    }

    const usuario = await em.findOne(Usuario, { mail });
    if (!usuario) {
      return res.status(401).json();
    }

    const passwordMatch = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordMatch) {
      return res.status(401).json();
    }

    // elimina contraseña antes de enviar el usuario, probarlo
    const { contrasena: _, ...usuarioSinContrasena } = usuario;

    const rol =
      usuarioSinContrasena.nombreFantasia === null ? 'cliente' : 'prestador';

    const token = jwt.sign({ id: usuarioSinContrasena.id, rol }, JWT_SECRET, {
      expiresIn: '1d',
    });

    return res
      .status(200)
      .json({ message: 'Login exitoso', token, data: usuarioSinContrasena });
  } catch (error: any) {
    console.error('Error en loginUsuario:', error);
    return res
      .status(500)
      .json({ message: 'Error interno en login', error: error.message });
  }
}

//configuración mailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'reformixoficial@gmail.com',
    pass: 'mkyg zmvc hjux pkqr',
  },
});
//

async function recuperarContrasena(req: Request, res: Response) {
  try {
    const mail = req.body.mail as string;

    const usuario = await em.findOne(Usuario, { mail });
    if (!usuario) {
      return res.status(404).json();
    }

    //Generar codigo de 6 digitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    codigosRecuperacion[mail] = {
      codigo,
      expiracion: new Date(Date.now() + 5 * 60 * 1000), // código vence en 5 minutos
    };

    await transporter.sendMail({
      from: 'forgotpassword <reformixoficial@gmail.com>',
      to: mail,
      subject: 'Recuperación de contraseña',
      text: `Tu código de recuperación es: ${codigo} y expirará en 5 minutos`,
    });
    return res.status(200).json(); //Manda mail de recuperación
  } catch (error) {
    return res.status(500).json();
  }
}

const codigosRecuperacion: {
  [mail: string]: { codigo: string; expiracion: Date };
} = {};

async function validarCodigoRecuperacion(req: Request, res: Response) {
  const { mail, codigo } = req.body;
  const registro = codigosRecuperacion[mail];
  if (registro.expiracion < new Date() || registro.codigo !== codigo)
    return res.status(400).json(); //codigo incorrecto
  return res.status(200).json(); //codigo valido
}

async function cambiarPassword(req: Request, res: Response) {
  const { mail, codigo, nuevaContrasena } = req.body;

  const registro = codigosRecuperacion[mail];

  const usuario = await em.findOne(Usuario, { mail });

  usuario!.contrasena = await bcrypt.hash(nuevaContrasena, 10);
  await em.flush();

  // Elimina el código usado
  delete codigosRecuperacion[mail];

  return res.status(200).json(); //se cambió la password
}

async function putOauth(
  id: number,
  access_token: string,
  refresh_token: string,
  user_id: string,
  public_key: string,
  mpTokenExpiration: Date
) {
  try {
    const updateUser = await em.findOneOrFail(Usuario, { id });
    em.assign(updateUser, {
      mpAccessToken: access_token, // Guarda el access token
      mpRefreshToken: refresh_token, // Guarda el refresh token
      mpUserId: user_id, // Guarda el user_id de MercadoPago
      mpPublicKey: public_key, // Guarda la public key
      mpTokenExpiration: mpTokenExpiration,
    });
    await em.flush();
    console.log('Tokens de MercadoPago actualizados');
  } catch (error: any) {
    console.error('Error en putOauth:', error);
  }
}
async function getOauth(id: number) {
  try {
    const user = await em.findOneOrFail(Usuario, { id }, {});
    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
async function uploadProfileImage(req: Request, res: Response) {
  //! Por razones de seguridad, MikroORM no deja usar la instancia global del em
  //! En contextos de operaciones asincronas como subida de archivos, ya que puede causar
  //! 'race conditions' y 'Corrupción de datos'
  //*Es por eso que se utiliza un fork de la instancia
  const emFork = em.fork();
  try {
    console.log('Upload request received');
    console.log('req.file:', req.file); // Debug log
    console.log('req.params.userId:', req.params.userId); // Debug log
    console.log('req.body:', req.body); // Debug log
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }
    const userId = req.params.userId;
    const user = await emFork.findOne(Usuario, { id: Number(userId) });
    if (!user) {
      await fs.unlink(req.file.path); // Elimina el archivo subido si el usuario no existe
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    //Borra la foto anterior si existe
    if (user.foto) {
      const RutaFotoVieja = path.join(__dirname, '../../public', user.foto);
      try {
        await fs.unlink(RutaFotoVieja);
      } catch (error) {
        console.error('Error al eliminar la foto vieja:', error);
      }
    }
    //procesa y optimiza la imagen
    const urlOptimizada = await processProfileImage(
      req.file.path,
      Number(user.id)
    );
    console.log('✅ Image processed successfully');
    console.log('🔗 Returned URL:', urlOptimizada);
    //Limpia la imagen subida
    const baseUrl = process.env.BASE_URL || 'https://reformix.site';

    const fullPath = path.join(__dirname, '../../public', urlOptimizada);
    try {
      await fs.access(fullPath);
      console.log('✅ File exists at:', fullPath);
    } catch (error) {
      console.error('❌ File does NOT exist at:', fullPath);
    }
    const fullImageUrl = `${baseUrl}${urlOptimizada}`;
    await fs.unlink(req.file.path);
    // Actualiza el usuario en la base
    user.foto = fullImageUrl;
    await emFork.flush();

    res.json({
      message: 'Foto de perfil actualizada correctamente',
      imageUrl: fullImageUrl,
      user: {
        id: user.id,
        foto: user.foto,
      },
    });
  } catch (error) {
    console.error('Error al Hsubir la imagen de perfil:', error);
    if (req.file) {
      try {
        await fs.unlink(req.file.path); //Intenta eliminar el archivo en caso de error
      } catch (error) {
        console.error('Error al eliminar la imagen de perfil:', error);
      }
    }
    res.status(500).json({ error: 'Error al subir la imagen de perfil' });
  }
}
export {
  sanitizeUsuarioInput,
  findAll,
  findPrestatariosByTipoServicioAndZona,
  findOne,
  findOneOnlyInfo,
  add,
  update,
  loginUsuario,
  remove,
  getCommentsByUserId,
  findOneByCookie,
  recuperarContrasena,
  validarCodigoRecuperacion,
  cambiarPassword,
  putOauth,
  getOauth,
  uploadProfileImage,
};
