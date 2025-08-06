import { Router } from 'express';
import {
  sanitizeUsuarioInput,
  findAll,
  findOne,
  findPrestatariosByTipoServicioAndZona,
  add,
  update,
  remove,
  getCommentsByUserId,
} from './usuario.controler.js';

export const usuarioRouter = Router();

usuarioRouter.get('/', findAll);
usuarioRouter.get(
  '/prestatarios/:tipoServicio/:zona/:orderBy',
  findPrestatariosByTipoServicioAndZona
);
usuarioRouter.get('/:id', findOne);
usuarioRouter.get('/comments/:id', getCommentsByUserId);
usuarioRouter.get('/:id', findOne);
usuarioRouter.post('/', sanitizeUsuarioInput, add);
usuarioRouter.put('/:id', sanitizeUsuarioInput, update);
usuarioRouter.patch('/:id', sanitizeUsuarioInput, update);
usuarioRouter.delete('/:id', remove);
