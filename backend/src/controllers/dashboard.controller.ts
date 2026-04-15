import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { UserRepository } from '../repositories/user.repository';
import { ProductRepository } from '../repositories/product.repository';
import { asyncHandler } from '../utils/asyncHandler';

const dashboardService = new DashboardService(new UserRepository(), new ProductRepository());

export const getDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const result = await dashboardService.getCounters();
  res.json(result);
});
