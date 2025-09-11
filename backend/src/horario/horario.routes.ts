import { Router } from 'express';
import {
  findAll,
  findManyByUser,
  add,
  update,
  remove,
} from './horario.controler.js';
import {
  horarioSchema,
  createHorarioValidation,
  idParamValidation,
  updateHorarioValidation,
} from './horario.schemas.js';
import {
  validateBody,
  validateParams,
  validateQuery,
  authenticateToken,
} from '../utils/apiMiddleware.js';

export const horarioRouter = Router();

// ==================== GET ROUTES ====================
horarioRouter.get('/', findAll);

horarioRouter.get(
  '/:usuario',
  validateParams(idParamValidation),
  findManyByUser
);

// ==================== POST ROUTES ====================
horarioRouter.post('/', validateBody(createHorarioValidation), add);

// ==================== PUT/PATCH ROUTES ====================
horarioRouter.put(
  '/:id',
  validateBody(updateHorarioValidation),
  validateParams(idParamValidation),
  update
);

horarioRouter.patch(
  '/:id',
  validateBody(updateHorarioValidation),
  validateParams(idParamValidation),
  update
);

// ==================== DELETE ROUTES ====================
horarioRouter.delete('/:id', validateParams(idParamValidation), remove);
