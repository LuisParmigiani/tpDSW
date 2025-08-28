import { Router } from 'express';
import {
  sanitizeTurnoInput,
  findall,
  findone,
  add,
  update,
  remove,
  getTurnosByUserId,
  getTurnosByPrestadorId,
  getTurnsPerDay,
} from './turno.controler.js';
import { verifyToken } from '../shared/middleware/auth.middleware.js';
export const turnoRouter = Router();

turnoRouter.get('/', findall);
turnoRouter.get(
  '/byUser/:cantItemsPerPage?/:currentPage?/:selectedValueShow?/:selectedValueOrder?',
  verifyToken,
  getTurnosByUserId
);
turnoRouter.get(
  '/byPrestador/:id/:cantItemsPerPage?/:currentPage?/:selectedValueShow?/:selectedValueOrder?',
  getTurnosByPrestadorId
);
turnoRouter.get('/turnosPorDia/:id/:date', getTurnsPerDay);
turnoRouter.get('/:id', findone);
turnoRouter.post('/', sanitizeTurnoInput, add);
turnoRouter.put('/:id', sanitizeTurnoInput, update);
turnoRouter.patch('/:id', sanitizeTurnoInput, update);
turnoRouter.delete('/:id', remove);
