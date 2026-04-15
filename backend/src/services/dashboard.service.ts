import { UserRepository } from '../repositories/user.repository';
import { ProductRepository } from '../repositories/product.repository';

export class DashboardService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly productRepo: ProductRepository
  ) {}

  async getCounters() {
    const totalUsers = await this.userRepo.count();
    const totalProducts = await this.productRepo.count();

    return { totalUsers, totalProducts };
  }
}
