import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError';

export const globalErrorHandler: ErrorRequestHandler = (
  err: any, _req: Request, res: Response, _next: NextFunction
) => {
  console.error(`[ERROR] ${err.message}`);

  if (err.name === 'CastError') {
    res.status(400).json({ message: 'Formato de ID inválido fornecido.' });
    return;
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    res.status(409).json({ message: `Dado duplicado: ${field} já cadastrado.` });
    return;
  }

  // pega o status correto do AppError ou joga 500 como fallback
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  res.status(statusCode).json({ message: err instanceof AppError ? err.message : 'Erro interno do servidor' });
};
