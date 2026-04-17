import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

export interface JwtPayload { id: string; email: string; profile: string; }

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
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError('JWT_SECRET não configurado!', 500);
    req.user = jwt.verify(token, secret) as JwtPayload;
    next(); 
  } catch {
    res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.profile !== 'admin') {
    res.status(403).json({ message: 'Acesso negado: apenas administradores.' });
    return;
  }
  next();
};
