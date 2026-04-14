import { Request, Response } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { ProductRepository } from '../repositories/product.repository';

const userRepo = new UserRepository();
const productRepo = new ProductRepository();

export const getDashboard = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [totalUsers, totalProducts] = await Promise.all([
      userRepo.count(),
      productRepo.count(),
    ]);
    res.json({ totalUsers, totalProducts });
  } catch (err: any) {
     res.status(500).json({ message: err.message });
  }
};
