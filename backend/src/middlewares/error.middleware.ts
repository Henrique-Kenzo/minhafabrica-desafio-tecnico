import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export const globalErrorHandler: ErrorRequestHandler = (
  err: Error, req: Request, res: Response, next: NextFunction
) => {
  console.error(`[ERROR] ${err.message}`);
  
  // Tratamos o res.status para o Typescript permitir optional chaining neste caso manual
  const status = (err as any).statusCode || 500;
  
  // As respostas sempre vêm no formato { "message": "..." } conforme exigido pelo exercício
  res.status(status).json({ message: err.message || 'Erro interno do servidor' });
};
