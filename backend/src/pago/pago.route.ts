import {
  findall,
  findone,
  add,
  update,
  remove,
  sanitizePagoInput,
} from './pago.controler.js';
import { Router } from 'express';

export const PagoRouter = Router();

PagoRouter.get('/', findall);
PagoRouter.get('/:id', findone);
PagoRouter.post('/', sanitizePagoInput, add);
PagoRouter.put('/:id', sanitizePagoInput, update);
PagoRouter.delete('/:id', remove);
