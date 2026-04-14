import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserRepository } from '../repositories/user.repository';

// Inicializando instâncias para este controller
const authService = new AuthService(new UserRepository());

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
      return;
    }
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};

export const seed = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.seed();
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
