import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Nome do produto é obrigatório.'),
  description: z.string().min(1, 'Descrição é obrigatória.'),
  price: z.number().min(0, 'O preço não pode ser negativo.'),
  stock: z.number().int('Estoque deve ser inteiro.').min(0, 'Estoque não pode ser negativo.'),
  category: z.string().min(1, 'Categoria é obrigatória.'),
  imageUrl: z.string().optional().or(z.literal('')),
});

export const updateProductSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0, 'O preço não pode ser negativo.').optional(),
  stock: z.number().int('Estoque deve ser inteiro.').min(0, 'Estoque não pode ser negativo.').optional(),
  category: z.string().optional(),
  imageUrl: z.string().optional(),
});
