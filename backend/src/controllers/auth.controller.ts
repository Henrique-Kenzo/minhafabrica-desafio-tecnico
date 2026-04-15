import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserRepository } from '../repositories/user.repository';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

const authService = new AuthService(new UserRepository());

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError('E-mail e senha são obrigatórios', 400);
  }
  const result = await authService.login(email, password);
  res.status(200).json(result);
});

export const seed = asyncHandler(async (_req: Request, res: Response) => {
  const result = await authService.seed();
  res.status(200).json(result);
});
