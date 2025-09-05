import { Request, Response, NextFunction } from 'express';
import { Servicio } from './servicio.entity.js';
import { orm } from '../shared/db/orm.js';
import { Turno } from '../turno/turno.entity.js';
import { Tarea } from '../tarea/tarea.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';

const em = orm.em;

function sanitizeServicioInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizeServicioInput = {
    precio: req.body.precio,
    tarea: req.body.tarea,
    usuarios: req.body.usuarios,
    turnos: req.body.turnos,
  };
  Object.keys(req.body.sanitizeServicioInput).forEach((key) => {
    if (req.body.sanitizeServicioInput[key] === undefined) {
      delete req.body.sanitizeServicioInput[key];
    }
  });
  next();
}

// Find all services
async function findall(req: Request, res: Response) {
  try {
    const services = await em.find(
      Servicio,
      {},
      { populate: ['usuario', 'tarea', 'turnos'] }
    );
    res.status(200).json({ message: 'found all services', data: services });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Find one service by ID
async function findone(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const service = await em.findOneOrFail(
      Servicio,
      { id },
      { populate: ['usuario', 'tarea', 'turnos'] }
    );
    res.status(200).json({ message: 'found one service', data: service });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Add a new service
async function add(req: Request, res: Response) {
  try {
    const service = em.create(Servicio, req.body.sanitizeServicioInput);
    await em.persistAndFlush(service);
    res.status(201).json({ message: 'created service', data: service });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Update an existing service
async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const service = await em.findOneOrFail(Servicio, { id });
    em.assign(service, req.body.sanitizeServicioInput);
    await em.persistAndFlush(service);
    res.status(200).json({ message: 'updated service', data: service });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Remove a service
async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const service = await em.findOneOrFail(Servicio, { id });
    await em.removeAndFlush(service);
    res.status(200).json({ message: 'removed service', data: service });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function getServicebyids(req: Request) {
  try {
    const ids = req.body.ids;
    return getServiceByServiceIds(ids);
  } catch (error: any) {
    throw error;
  }
}

async function getServiceByServiceIds(ids: number[]) {
  try {
    const services = await em.find(
      Servicio,
      { id: ids },
      { populate: ['tarea', 'usuario'] }
    );
    return services;
  } catch (error: any) {
    throw error;
  }
}

async function getById(id: number) {
  try {
    const service = await em.findOneOrFail(
      Servicio,
      { id },
      { populate: ['tarea', 'usuario'] }
    );
    return service;
  } catch (error: any) {
    throw error;
  }
}

// Obtener servicios por usuario
async function getByUser(req: Request, res: Response) {
  try {
    const usuarioId = Number.parseInt(req.params.usuarioId);

    if (!usuarioId) {
      return res.status(400).json({ 
        message: 'usuarioId es requerido' 
      });
    }

    const servicios = await em.find(Servicio, {
      usuario: usuarioId,
    }, {
      populate: ['tarea', 'tarea.tipoServicio', 'usuario']
    });

    res.status(200).json({ 
      message: 'Servicios encontrados', 
      data: servicios 
    });
  } catch (error: any) {
    console.error('Error en getByUser:', error);
    res.status(500).json({ message: error.message });
  }
}

// Crear o actualizar servicio por usuario y tarea
async function upsertByUserAndTask(req: Request, res: Response) {
  try {
    const { tareaId, usuarioId, precio } = req.body;

    if (!tareaId || !usuarioId || !precio || precio <= 0) {
      return res.status(400).json({ 
        message: 'tareaId, usuarioId y precio (>0) son requeridos' 
      });
    }

    // Buscar si ya existe un servicio con esta combinación
    const servicioExistente = await em.findOne(Servicio, {
      tarea: tareaId,
      usuario: usuarioId,
    });

    if (servicioExistente) {
      // Actualizar precio del servicio existente
      servicioExistente.precio = precio;
      await em.persistAndFlush(servicioExistente);
      res.status(200).json({ 
        message: 'Servicio actualizado', 
        data: servicioExistente,
        action: 'updated'
      });
    } else {
      // Crear nuevo servicio
      const nuevoServicio = em.create(Servicio, {
        precio,
        tarea: tareaId,
        usuario: usuarioId,
        estado: 'inactivo',
      });
      await em.persistAndFlush(nuevoServicio);
      res.status(201).json({ 
        message: 'Servicio creado', 
        data: nuevoServicio,
        action: 'created'
      });
    }
  } catch (error: any) {
    console.error('Error en upsertByUserAndTask:', error);
    res.status(500).json({ message: error.message });
  }
}

// Eliminar servicio por usuario y tarea
async function deleteByUserAndTask(req: Request, res: Response) {
  try {
    const { tareaId, usuarioId } = req.params;

    if (!tareaId || !usuarioId) {
      return res.status(400).json({ 
        message: 'tareaId y usuarioId son requeridos' 
      });
    }

    const servicio = await em.findOne(Servicio, {
      tarea: Number(tareaId),
      usuario: Number(usuarioId),
    });

    if (!servicio) {
      return res.status(404).json({ 
        message: 'Servicio no encontrado' 
      });
    }

    await em.removeAndFlush(servicio);
    res.status(200).json({ 
      message: 'Servicio eliminado exitosamente' 
    });
  } catch (error: any) {
    console.error('Error en deleteByUserAndTask:', error);
    res.status(500).json({ message: error.message });
  }
}

export {
  sanitizeServicioInput,
  findall,
  findone,
  getById,
  add,
  update,
  remove,
  getServicebyids,
  getServiceByServiceIds,
  getByUser,
  upsertByUserAndTask,
  deleteByUserAndTask,
};
