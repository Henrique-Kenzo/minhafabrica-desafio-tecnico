import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Formata os erros do Zod para algo mais legível
        const messages = (error as any).errors.map((e: any) => `${e.path.join('.')}: ${e.message}`);
        res.status(400).json({ 
          message: 'Erro de validação de dados', 
          details: messages 
        });
        return;
      }
      next(error);
    }
  };
};
