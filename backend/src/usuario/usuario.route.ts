import { Router } from 'express';
import {
  sanitizeUsuarioInput,
  findAll,
  findOne,
  findOneOnlyInfo,
  findPrestatariosByTipoServicioAndZona,
  add,
  update,
  remove,
  getCommentsByUserId,
  loginUsuario,
  findOneByCookie,
  recuperarContrasena,
  validarCodigoRecuperacion,
  cambiarPassword,
  uploadProfileImage,
} from './usuario.controler.js';
import { verifyToken } from '../shared/middleware/auth.middleware.js';

export const usuarioRouter = Router();

usuarioRouter.get('/', findAll);
usuarioRouter.get(
  '/prestatarios/:tipoServicio/:tarea?/:zona/:orderBy',
  findPrestatariosByTipoServicioAndZona
);
usuarioRouter.get('/login', loginUsuario);
usuarioRouter.get('/cookie', verifyToken, findOneByCookie);
usuarioRouter.post('/validar-codigo', validarCodigoRecuperacion);
usuarioRouter.post('/recuperar', recuperarContrasena);
usuarioRouter.get('/:id', findOne);
usuarioRouter.get('/onlyInfo/:id', findOneOnlyInfo);
usuarioRouter.get('/comments/:id', getCommentsByUserId);
usuarioRouter.post('/', sanitizeUsuarioInput, add);
usuarioRouter.put('/:id', sanitizeUsuarioInput, update);
usuarioRouter.patch('/:id', sanitizeUsuarioInput, update);
usuarioRouter.delete('/:id', remove);
usuarioRouter.post('/cambiar-password', cambiarPassword);
usuarioRouter.post('/upload-profile-image/:id', uploadProfileImage);
