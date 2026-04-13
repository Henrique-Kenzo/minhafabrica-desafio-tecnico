import bcrypt from 'bcryptjs';

export const hashPassword = async (plain: string): Promise<string> => bcrypt.hash(plain, 12);
export const comparePassword = async (plain: string, hashed: string): Promise<boolean> => bcrypt.compare(plain, hashed);
