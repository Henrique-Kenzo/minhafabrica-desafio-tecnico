import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../models/user.model';
import { hashPassword } from '../utils/password.utils';
import { AppError } from '../utils/AppError';

export interface CreateUserDTO {
  name: string; email: string; password?: string; profile?: 'admin' | 'user';
}

export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async findAll(page = 1, limit = 10, search?: string, profile?: string) {
    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (profile) filter.profile = profile;

    return this.userRepo.findAll(page, limit, filter);
  }

  async create(data: CreateUserDTO): Promise<Omit<IUser, 'password'>> {
    const exists = await this.userRepo.findByEmail(data.email);
    if (exists) throw new AppError('E-mail já cadastrado', 400);

    let hashed = undefined;
    if (data.password) {
      hashed = await hashPassword(data.password);
    }

    const user = await this.userRepo.create({ ...data, password: hashed });
    const { password, ...userWithoutPassword } = user.toObject ? user.toObject() : user;
    return userWithoutPassword as Omit<IUser, 'password'>;
  }

  async update(id: string, data: Partial<CreateUserDTO>) {
    if (data.password) {
      data.password = await hashPassword(data.password);
    }
    const updated = await this.userRepo.update(id, data);
    if (!updated) throw new AppError('Usuário não encontrado', 404);
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.userRepo.delete(id);
    if (!deleted) throw new AppError('Usuário não encontrado', 404);
    return deleted;
  }
}
