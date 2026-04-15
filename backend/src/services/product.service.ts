import { ProductRepository } from '../repositories/product.repository';
import { IProduct } from '../models/product.model';
import { AppError } from '../utils/AppError';

export interface CreateProductDTO {
  name: string; description: string; price: number; stock: number; category: string;
}

export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}

  async findAll(page = 1, limit = 10, search?: string, category?: string) {
    const filter: any = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    return this.productRepo.findAll(page, limit, filter);
  }

  async getCategories(): Promise<string[]> {
    return this.productRepo.getCategories();
  }

  async create(data: CreateProductDTO): Promise<IProduct> {
    if (data.price <= 0) throw new AppError('Preço deve ser maior que zero', 400);
    if (data.stock < 0) throw new AppError('Estoque não pode ser negativo', 400);

    return this.productRepo.create(data);
  }

  async update(id: string, data: Partial<CreateProductDTO>) {
    if (data.price !== undefined && data.price <= 0) throw new AppError('Preço deve ser maior que zero', 400);
    if (data.stock !== undefined && data.stock < 0) throw new AppError('Estoque não pode ser negativo', 400);

    const updated = await this.productRepo.update(id, data);
    if (!updated) throw new AppError('Produto não encontrado', 404);
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.productRepo.delete(id);
    if (!deleted) throw new AppError('Produto não encontrado', 404);
    return deleted;
  }
}
