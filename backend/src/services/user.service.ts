import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../models/user.model';
import { hashPassword } from '../utils/password.utils';

// Interfaces DTO (Data Transfer Object) controlam o que deve chegar do frontend
export interface CreateUserDTO {
  name: string; email: string; password: string; role?: 'admin' | 'user';
}

export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async create(data: CreateUserDTO): Promise<IUser> {
    const exists = await this.userRepo.findByEmail(data.email);
    
    // Regra de Negócio: Não permite criar usuário de email repetido.
    if (exists) throw new Error('E-mail já cadastrado');
    
    // Transforma a senha "123" em "***xyz" antes de mandar salvar
    const hashed = await hashPassword(data.password);
    return this.userRepo.create({ ...data, password: hashed });
  }
}
