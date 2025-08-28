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
  loginUsuario,
  findOneByCookie,
} from './usuario.controler.js';
import { verifyToken } from '../shared/middleware/auth.middleware.js';

export const usuarioRouter = Router();

usuarioRouter.get('/', findAll);
usuarioRouter.get(
  '/prestatarios/:tipoServicio/:zona/:orderBy',
  findPrestatariosByTipoServicioAndZona
);
usuarioRouter.get('/login', loginUsuario);
usuarioRouter.get('/cookie', verifyToken, findOneByCookie);
usuarioRouter.get('/:id', findOne);
usuarioRouter.get('/comments/:id', getCommentsByUserId);
usuarioRouter.post('/', sanitizeUsuarioInput, add);
usuarioRouter.put('/:id', sanitizeUsuarioInput, update);
usuarioRouter.patch('/:id', sanitizeUsuarioInput, update);
usuarioRouter.delete('/:id', remove);
