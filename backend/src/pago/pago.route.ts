<<<<<<< HEAD
import {
  findall,
  findone,
  add,
  update,
  remove,
  getEstadisticasByUser,
  debugPagosByUser,
  sanitizePagoInput,
} from './pago.controller.js';
=======
import { findall, findone, add, update, remove } from './pago.controller.js';
>>>>>>> pagoApi
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
<<<<<<< HEAD
PagoRouter.get('/estadisticas/:usuarioId', getEstadisticasByUser);
PagoRouter.get('/debug/:usuarioId', debugPagosByUser);
PagoRouter.get('/:id', findone);
PagoRouter.post('/', sanitizePagoInput, add);
PagoRouter.put('/:id', sanitizePagoInput, update);
PagoRouter.delete('/:id', remove);
=======
PagoRouter.get('/:id', validateParams(idParamValidation), findone);
PagoRouter.post('/', validateBody(baseSchemaWithTurnoId), add); // Usa pagoBaseSchema directamente
PagoRouter.put(
  '/:id',
  validateParams(idParamValidation),
  validateBody(updatePagoValidationSchema), // Cambiar a updatePagoValidationSchema
  update
);
PagoRouter.delete('/:id', validateParams(idParamValidation), remove);
>>>>>>> pagoApi
