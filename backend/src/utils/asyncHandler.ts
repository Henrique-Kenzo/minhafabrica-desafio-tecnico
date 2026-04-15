import { Request, Response, NextFunction } from 'express';

// wrapper pra evitar ficar repetindo try/catch nos controllers
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
