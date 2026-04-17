import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { AppError } from '../utils/AppError';

export class AuthService {
  constructor(private readonly userRepo: UserRepository) {}

  async login(email: string, pass: string): Promise<{ token: string, user: any }> {
    const user = await this.userRepo.findByEmailWithPassword(email);
    if (!user || !user.password) throw new AppError('Credenciais inválidas', 401);

    const isMatch = await comparePassword(pass, user.password);
    if (!isMatch) throw new AppError('Credenciais inválidas', 401);

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError('JWT_SECRET não configurado!', 500);

    const token = jwt.sign(
      { id: user._id, email: user.email, profile: user.profile },
      secret,
      { expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as any }
    );

    const { password, ...userWithoutPassword } = user;

    return { token, user: userWithoutPassword };
  }

  async seed(): Promise<{ message: string }> {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME;

    if (!adminEmail || !adminPass || !adminName) {
      throw new AppError('Variáveis ADMIN_EMAIL, ADMIN_PASSWORD e ADMIN_NAME não configuradas', 500);
    }

    const existing = await this.userRepo.findByEmail(adminEmail);
    if (existing) return { message: 'Usuário admin já existe' };

    const hashed = await hashPassword(adminPass);
    try {
      await this.userRepo.create({
        name: adminName,
        email: adminEmail,
        password: hashed,
        profile: 'admin',
      });
      return { message: 'Seed realizado com sucesso' };
    } catch (error: any) {
      if (error && error.code === 11000) {
        return { message: 'Usuário admin já existe' };
      }
      throw error;
    }
  }
}
