import { Request, Response, NextFunction } from 'express';
import { Usuario } from './usuario.entity.js';
import {
  getTurnosByServicioIdHelper,
  getTurnsPerDay,
} from '../turno/turno.controler.js';

import bcrypt from 'bcrypt';
import { orm } from '../shared/db/orm.js';
import nodemailer from 'nodemailer';
const em = orm.em;

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
    tareas: req.body.tareas,
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
      { populate: ['turnos', 'servicios', 'tiposDeServicio', 'horarios'] }
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
    const orderBy = req.params.orderBy as string;
    const maxItems = Number(req.query.maxItems) || 6;
    const page = Number(req.query.page) || 1;
    const offset = (page - 1) * maxItems;
    let filtroTipoServicio = '';
    if (nombreTipoServicio !== 'Todos') {
      filtroTipoServicio = nombreTipoServicio;
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
    if (filtroZona) {
      whereClause.zonas = { descripcion_zona: filtroZona };
    }
    //! Por un tema de performance se tendría que calcular y guardar en algún lado la calificación, apra no tener que calcular todas las calificaciones
    //! y ordenar 30 objetos cada vez que se llama
    const [prestatarios, total] = await em.findAndCount(Usuario, whereClause, {
      populate: ['tiposDeServicio', 'zonas', 'servicios', 'servicios.turnos'],
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
      return {
        id: prest.id,
        nombre: prest.nombre,
        apellido: prest.apellido,
        nombreFantasia: prest.nombreFantasia,
        descripcion: prest.descripcion,
        foto: prest.foto,
        tiposDeServicio: prest.tiposDeServicio.getItems(),
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
      return res
        .status(400)
        .json({ message: 'Faltan datos de inicio de sesión' });
    }

    const usuario = await em.findOne(Usuario, { mail });
    if (!usuario) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const passwordMatch = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // elimina contraseña antes de enviar el usuario, probarlo
    const { contrasena: _, ...usuarioSinContrasena } = usuario;

    return res
      .status(200)
      .json({ message: 'Login exitoso', data: usuarioSinContrasena });
  } catch (error: any) {
    console.error('Error en loginUsuario:', error);
    return res
      .status(500)
      .json({ message: 'Error interno en login', error: error.message });
  }
}

//llevar todo esto a una carpeta y exportarlo
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'santiagomalet229@gmail.com',
    pass: 'yoxg geda hevd kxol',
  },
});

async function recuperarContrasena(req: Request, res: Response) {
  //linea para probar
  console.log('POST /recuperar llamado con body:', req.body);
  try {
    const mail = req.body.mail as string;
    if (!mail) {
      return res.status(400).json({ message: 'Falta el mail' });
    }

    const usuario = await em.findOne(Usuario, { mail });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    //Generar codigo de 6 digitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    codigosRecuperacion[mail] = {
      codigo,
      expiracion: new Date(Date.now() + 10 * 60 * 1000), // 10 minutos
    };

    await transporter.sendMail({
      from: 'forgotpassword <santiagomalet229@gmail.com>',
      to: mail,
      subject: 'Recuperación de contraseña',
      text: `Tu código de recuperación es: ${codigo} y expirará en 10 minutos`,
    });
    return res.status(200).json({
      message: 'Si el usuario existe, se envió el mail de recuperación',
    });
  } catch (error) {
    console.error('Error en recuperarContrasena:', error); // <--- Muestra el error real
    return res.status(500).json({ message: 'Error interno en recuperación' });
  }
}

const codigosRecuperacion: {
  [mail: string]: { codigo: string; expiracion: Date };
} = {};

async function validarCodigoRecuperacion(req: Request, res: Response) {
  const { mail, codigo } = req.body;
  const registro = codigosRecuperacion[mail];
  if (!registro)
    return res.status(400).json({ message: 'No se solicitó recuperación' });
  if (registro.expiracion < new Date())
    return res.status(400).json({ message: 'Código expirado' });
  if (registro.codigo !== codigo)
    return res.status(400).json({ message: 'Código incorrecto' });
  return res.status(200).json({ message: 'Código válido' });
}

async function cambiarPassword(req: Request, res: Response) {
  const { mail, codigo, nuevaContrasena } = req.body;
  if (!mail || !codigo || !nuevaContrasena) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  const registro = codigosRecuperacion[mail];
  if (!registro) {
    return res.status(400).json({ message: 'No se solicitó recuperación' });
  }
  if (registro.expiracion < new Date()) {
    return res.status(400).json({ message: 'Código expirado' });
  }
  if (registro.codigo !== codigo) {
    return res.status(400).json({ message: 'Código incorrecto' });
  }

  const usuario = await em.findOne(Usuario, { mail });
  if (!usuario) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  usuario.contrasena = await bcrypt.hash(nuevaContrasena, 10);
  await em.flush();

  // Elimina el código usado
  delete codigosRecuperacion[mail];

  return res.status(200).json({ message: 'Contraseña cambiada correctamente' });
}

export {
  sanitizeUsuarioInput,
  findAll,
  findPrestatariosByTipoServicioAndZona,
  findOne,
  add,
  update,
  loginUsuario,
  remove,
  getCommentsByUserId,
  recuperarContrasena,
  validarCodigoRecuperacion,
  cambiarPassword,
};
