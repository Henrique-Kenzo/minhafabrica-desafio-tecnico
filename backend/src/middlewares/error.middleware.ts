import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError';

export const globalErrorHandler: ErrorRequestHandler = (
  err: Error, _req: Request, res: Response, _next: NextFunction
) => {
  console.error(`[ERROR] ${err.message}`);

  // pega o status correto do AppError ou joga 500 como fallback
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  res.status(statusCode).json({ message: err.message || 'Erro interno do servidor' });
};
