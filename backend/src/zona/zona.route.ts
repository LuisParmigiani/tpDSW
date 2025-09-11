import { Router } from 'express';
import {
  validateBody,
  validateParams,
  validateQuery,
  authenticateToken,
} from '../utils/apiMiddleware.js';
import {
  createZonaValidation,
  updateZonaValidation,
  idParamValidation,
} from './zona.schemas.js';
import { findAll, findOne, add, update, remove } from './zona.controller.js';

export const zonaRouter = Router();

// ==================== POST ROUTES ====================
zonaRouter.post('/', validateBody(createZonaValidation), add);

// ==================== GET ROUTES ====================
zonaRouter.get('/', findAll);

zonaRouter.get('/:id', validateParams(idParamValidation), findOne);

// ==================== PUT ROUTES ====================
zonaRouter.put(
  '/:id',
  validateParams(idParamValidation),
  validateBody(updateZonaValidation),
  update
);

// ==================== PATCH ROUTES ====================
zonaRouter.patch(
  '/:id',
  validateParams(idParamValidation),
  validateBody(updateZonaValidation),
  update
);

// ==================== DELETE ROUTES ====================
zonaRouter.delete('/:id', validateParams(idParamValidation), remove);
