import { Request, Response } from 'express';
import { AppError } from '../utils/AppError';

export const uploadImage = (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('Nenhuma imagem enviada', 400);
  }

  // Converte o buffer do arquivo para base64 data URI — salva direto no banco, sem disco
  const base64 = req.file.buffer.toString('base64');
  const imageUrl = `data:${req.file.mimetype};base64,${base64}`;

  res.json({ imageUrl });
};
