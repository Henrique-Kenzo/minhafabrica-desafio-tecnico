import { ProductRepository } from '../repositories/product.repository';
import { IProduct } from '../models/product.model';

export interface CreateProductDTO {
  name: string; description: string; price: number; stock: number; category: string;
}

export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}

  async create(data: CreateProductDTO): Promise<IProduct> {
    if (data.price <= 0) throw new Error('Preço deve ser maior que zero');
    if (data.stock < 0) throw new Error('Estoque não pode ser negativo');

    return this.productRepo.create(data);
  }
}
