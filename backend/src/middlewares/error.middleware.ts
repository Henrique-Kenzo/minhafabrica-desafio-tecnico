import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError';

export const globalErrorHandler: ErrorRequestHandler = (
  err: any, _req: Request, res: Response, _next: NextFunction
) => {
  const errorMessage = err?.message || err?.toString() || 'Erro desconhecido';
  console.error(`[ERROR] ${errorMessage}`);

  if (err?.name === 'ZodError') {
    res.status(400).json({ message: 'Erro de validação', details: err.errors });
    return;
  }

  if (err?.name === 'CastError') {
    res.status(400).json({ message: 'Formato de ID inválido fornecido.' });
    return;
  }

  if (err?.code === 11000) {
    const field = Object.keys(err?.keyValue || {})[0] || 'Desconhecido';
    res.status(409).json({ message: `Dado duplicado: ${field} já cadastrado.` });
    return;
  }

  // pega o status correto do AppError ou joga 500 como fallback
  const statusCode = err?.statusCode || 500;

  res.status(statusCode).json({ message: err?.statusCode ? err?.message : 'Erro interno do servidor' });
};
