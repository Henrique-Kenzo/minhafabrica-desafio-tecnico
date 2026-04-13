
import { IUser, UserModel } from '../models/user.model';

export class UserRepository {
  // Lista paginada
  async findAll(page = 1, limit = 10): Promise<{ data: IUser[], total: number }> {
    const data = await UserModel.find().skip((page - 1) * limit).limit(limit).lean() as IUser[];
    const total = await UserModel.countDocuments();
    return { data, total };
  }

  // Acha usuário por email (Crucial pro Login)
  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).lean() as Promise<IUser | null>;
  }

  // Cria Usuário
  async create(data: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(data);
    return user.save();
  }

  // Utilizado pelo dashboard para exibir "Total de Usuários"
  async count(): Promise<number> {
    return UserModel.countDocuments();
  }
}
