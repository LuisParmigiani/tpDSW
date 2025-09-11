import { Router } from 'express';
import {
  sanitizeServicioInput,
  findall,
  findone,
  add,
  update,
  remove,
  getByUser,
  upsertByUserAndTask,
  deleteByUserAndTask,
  deactivateByUserAndTask,
} from './servicio.controler.js';

export const servicioRouter = Router();

servicioRouter.get('/', findall);
servicioRouter.get('/:id', findone);
servicioRouter.post('/', sanitizeServicioInput, add);
servicioRouter.put('/:id', sanitizeServicioInput, update);
servicioRouter.patch('/:id', sanitizeServicioInput, update);
servicioRouter.delete('/:id', remove);

// Nuevas rutas específicas
servicioRouter.get('/user/:usuarioId', getByUser);
servicioRouter.post('/upsert', upsertByUserAndTask);
servicioRouter.delete('/user/:usuarioId/task/:tareaId', deleteByUserAndTask);
servicioRouter.patch('/user/:usuarioId/task/:tareaId/deactivate', deactivateByUserAndTask);
