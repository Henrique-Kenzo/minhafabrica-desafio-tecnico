import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { hashPassword, comparePassword } from '../utils/password.utils';

export class AuthService {
  constructor(private readonly userRepo: UserRepository) {}

  async login(email: string, pass: string): Promise<{ token: string, user: any }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error('Credenciais inválidas');

    const isMatch = await comparePassword(pass, user.password);
    if (!isMatch) throw new Error('Credenciais inválidas');

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as any }
    );

    const { password, ...userWithoutPassword } = user;
    
    return { token, user: userWithoutPassword };
  }

  async seed(): Promise<{ message: string }> {
    const existing = await this.userRepo.findByEmail('admin@minhafabrica.com');
    if (existing) return { message: 'Usuário admin já existe' };

    const hashed = await hashPassword('senha123');
    await this.userRepo.create({
      name: 'Admin',
      email: 'admin@minhafabrica.com',
      password: hashed,
      role: 'admin',
    });
    return { message: 'Seed realizado com sucesso' };
  }
}
