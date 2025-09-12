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
import { Router } from 'express';

export const PagoRouter = Router();

PagoRouter.get('/', findall);
PagoRouter.get('/estadisticas/:usuarioId', getEstadisticasByUser);
PagoRouter.get('/debug/:usuarioId', debugPagosByUser);
PagoRouter.get('/:id', findone);
PagoRouter.post('/', sanitizePagoInput, add);
PagoRouter.put('/:id', sanitizePagoInput, update);
PagoRouter.delete('/:id', remove);
