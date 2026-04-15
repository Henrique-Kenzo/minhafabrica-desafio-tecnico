import { IUser, UserModel } from '../models/user.model';

export class UserRepository {
  async findAll(page = 1, limit = 10, filter: object = {}): Promise<{ data: IUser[], total: number }> {
    const data = await UserModel.find(filter).select('-password').skip((page - 1) * limit).limit(limit).lean() as IUser[];
    const total = await UserModel.countDocuments(filter);
    return { data, total };
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).lean() as Promise<IUser | null>;
  }
  
  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).lean() as Promise<IUser | null>;
  }

  async findByEmailWithPassword(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).select('+password').lean() as Promise<IUser | null>;
  }

  async create(data: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(data);
    return user.save();
  }

  async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(id, data, { new: true }).lean() as Promise<IUser | null>;
  }

  async delete(id: string): Promise<IUser | null> {
    return UserModel.findByIdAndDelete(id).lean() as Promise<IUser | null>;
  }

  async count(): Promise<number> {
    return UserModel.countDocuments();
  }
}
