// routes/auth.routes.ts
import { Router, Request } from 'express';
import { verifyToken } from './auth.middleware.js';

interface JWTPayload {
  id: number;
  rol: 'cliente' | 'prestador';
}
interface AuthRequest extends Request {
  user?: JWTPayload;
}

const router = Router();

// Endpoint que usa React para verificar si está autenticado
router.get('/verificar', verifyToken, (req: AuthRequest, res) => {
  if (req.user === undefined) {
    res.json({
      user: null,
    });
  } else {
    res.json({
      user: {
        id: req.user!.id,
        rol: req.user!.rol,
      },
    });
  }
});

export default router;
