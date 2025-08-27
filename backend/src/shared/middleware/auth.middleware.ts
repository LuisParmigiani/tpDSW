import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'; // en producción sacalo a env
interface AuthRequest extends Request {
  user?: {
    id: string;
    rol: string;
  };
}
// Middleware para verificar el token de la cookie

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      rol: string;
    };

    req.user = decoded; // ahora TypeScript lo reconoce ✅
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
