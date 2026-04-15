import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2, 'Nome muito curto.'),
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres.'),
  profile: z.enum(['admin', 'user']).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Nome muito curto.').optional(),
  email: z.string().email('E-mail inválido.').optional(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres.').optional(),
  profile: z.enum(['admin', 'user']).optional(),
});
