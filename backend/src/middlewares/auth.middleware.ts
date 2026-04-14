import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Estendemos o Request do Express para o TypeScript reconhecer o req.user
export interface JwtPayload { id: string; email: string; role: string; }

declare global {
  namespace Express { interface Request { user?: JwtPayload; } }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token não fornecido' });
    return;
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    req.user = jwt.verify(token, secret) as JwtPayload;
    next(); 
  } catch {
    res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};
