import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { ProductRepository } from '../repositories/product.repository';
import { asyncHandler } from '../utils/asyncHandler';

const productService = new ProductService(new ProductRepository());

export const findAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const search = req.query.search as string;
  const category = req.query.category as string;
  const result = await productService.findAll(page, limit, search, category);
  res.json(result);
});

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const result = await productService.getCategories();
  res.json(result);
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.create(req.body);
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.update(req.params.id as string, req.body);
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  await productService.delete(req.params.id as string);
  res.status(204).send();
});
