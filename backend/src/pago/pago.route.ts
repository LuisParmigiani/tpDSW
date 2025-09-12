import { findall, findone, add, update, remove } from './pago.controller.js';
import { Router } from 'express';
import { validateBody, validateParams } from '../utils/apiMiddleware.js';
import {
  idParamValidation,
  pagoBaseSchema,
  updatePagoValidationSchema,
  baseSchemaWithTurnoId,
} from './pago.schemas.js';

export const PagoRouter = Router();

PagoRouter.get('/', findall);
PagoRouter.get('/:id', validateParams(idParamValidation), findone);
PagoRouter.post('/', validateBody(baseSchemaWithTurnoId), add); // Usa pagoBaseSchema directamente
PagoRouter.put(
  '/:id',
  validateParams(idParamValidation),
  validateBody(updatePagoValidationSchema), // Cambiar a updatePagoValidationSchema
  update
);
PagoRouter.delete('/:id', validateParams(idParamValidation), remove);
