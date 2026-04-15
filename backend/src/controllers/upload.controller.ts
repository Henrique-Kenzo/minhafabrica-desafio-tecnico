import { Request, Response } from 'express';
import { AppError } from '../utils/AppError';

export const uploadImage = (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('Nenhuma imagem enviada', 400);
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
};
