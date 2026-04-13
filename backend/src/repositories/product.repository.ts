import { IProduct, ProductModel } from '../models/product.model';

export class ProductRepository {
  async findAll(page = 1, limit = 10): Promise<{ data: IProduct[], total: number }> {
    const data = await ProductModel.find().skip((page - 1) * limit).limit(limit).lean() as IProduct[];
    const total = await ProductModel.countDocuments();
    return { data, total };
  }

  async create(data: Partial<IProduct>): Promise<IProduct> {
    const product = new ProductModel(data);
    return product.save();
  }

  async count(): Promise<number> {
    return ProductModel.countDocuments();
  }
}
