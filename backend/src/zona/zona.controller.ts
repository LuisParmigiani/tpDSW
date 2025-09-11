import { Request, Response, NextFunction } from 'express';
import { Zona } from './zona.entity.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const zona = await em.find(Zona, {}, { populate: ['usuarios'] });

    res.status(200).json({
      message: 'found all Zonas',
      data: zona,
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const { id } = req.params; // Already validated as string that matches /^\d+$/
    const codZona = Number.parseInt(id);

    const zona = await em.findOneOrFail(
      Zona,
      { id: codZona },
      { populate: ['usuarios'] }
    );

    res.status(200).json({
      message: 'found one zona',
      data: zona,
    });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        message: 'Zona no encontrada',
      });
    }
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
}

async function add(req: Request, res: Response) {
  try {
    const zonaData = req.body; // Already validated by createZonaValidation schema

    // Check if zona with same descripcionZona already exists
    const existingZona = await em.findOne(Zona, {
      descripcionZona: zonaData.descripcionZona,
    });

    if (existingZona) {
      return res.status(409).json({
        error: 'ZONA_ALREADY_EXISTS',
        message: 'Ya existe una zona con esa descripción',
      });
    }

    const zona = em.create(Zona, zonaData);
    await em.flush();

    res.status(201).json({
      message: 'Zona creada exitosamente',
      data: zona,
    });
  } catch (error: any) {
    console.error('Error creating zona:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
}

async function update(req: Request, res: Response) {
  try {
    const { id } = req.params; // Already validated
    const updateData = req.body; // Already validated by updateZonaValidation schema
    const codZona = Number.parseInt(id);

    const zonaToUpdate = await em.findOneOrFail(Zona, { id: codZona });

    // Check if another zona with the same descripcionZona exists (only if changing descripcionZona)
    if (
      updateData.descripcionZona &&
      zonaToUpdate.descripcionZona !== updateData.descripcionZona
    ) {
      const existingZona = await em.findOne(Zona, {
        descripcionZona: updateData.descripcionZona,
      });

      if (existingZona) {
        return res.status(409).json({
          error: 'DESCRIPCION_ALREADY_EXISTS',
          message: 'Ya existe una zona con esa descripción',
        });
      }
    }

    em.assign(zonaToUpdate, updateData);
    await em.flush();

    res.status(200).json({
      message: 'updated zona',
      data: zonaToUpdate,
    });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        message: 'Zona no encontrada',
      });
    }

    console.error('Error updating zona:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params; // Already validated
    const codZona = Number.parseInt(id);

    const zona = await em.findOneOrFail(
      Zona,
      { id: codZona },
      { populate: ['usuarios'] }
    );

    // Check if zona has associated users before deleting
    if (zona.usuarios && zona.usuarios.length > 0) {
      return res.status(409).json({
        error: 'ZONA_HAS_USERS',
        message: 'No se puede eliminar la zona porque tiene usuarios asociados',
      });
    }

    await em.removeAndFlush(zona);

    res.status(200).json({
      message: 'deleted zona',
      data: zona,
    });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        message: 'Zona no encontrada',
      });
    }

    console.error('Error deleting zona:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
}

export { findAll, findOne, add, update, remove };
