import { IProduct, ProductModel } from '../models/product.model';

export class ProductRepository {
  async findAll(page = 1, limit = 10, filter: object = {}): Promise<{ data: IProduct[], total: number }> {
    const data = await ProductModel.find(filter).skip((page - 1) * limit).limit(limit).lean() as IProduct[];
    const total = await ProductModel.countDocuments(filter);
    return { data, total };
  }

  async findById(id: string): Promise<IProduct | null> {
    return ProductModel.findById(id).lean() as Promise<IProduct | null>;
  }

  async getCategories(): Promise<string[]> {
    return ProductModel.distinct('category');
  }

  async create(data: Partial<IProduct>): Promise<IProduct> {
    const product = new ProductModel(data);
    return product.save();
  }

  async update(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
    return ProductModel.findByIdAndUpdate(id, data, { new: true }).lean() as Promise<IProduct | null>;
  }

  async delete(id: string): Promise<IProduct | null> {
    return ProductModel.findByIdAndDelete(id).lean() as Promise<IProduct | null>;
  }

  async count(): Promise<number> {
    return ProductModel.countDocuments();
  }
}
