import { Router } from 'express';
import { login, seed } from '../controllers/auth.controller';
import { getDashboard } from '../controllers/dashboard.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';
import { findAllUsers, createUser, updateUser, deleteUser } from '../controllers/user.controller';
import { findAllProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../controllers/product.controller';
import { uploadImage } from '../controllers/upload.controller';
import { upload } from '../middlewares/upload.middleware';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema } from '../schemas/auth.schema';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';

const router = Router();

// --- 1. ROTAS PÚBLICAS ---
router.post('/auth/seed', seed);
router.post('/auth/login', validate(loginSchema), login);

// --- 2. ROTAS PROTEGIDAS (Usuário Logado) ---
router.use(verifyToken);

router.get('/dashboard', getDashboard);
router.get('/users', findAllUsers);

router.get('/products', findAllProducts);
router.get('/products/categories', getCategories);
router.post('/products/upload', upload.single('image'), uploadImage);
router.post('/products', validate(createProductSchema), createProduct);
router.put('/products/:id', validate(updateProductSchema), updateProduct);
router.delete('/products/:id', deleteProduct);

// --- 3. ROTAS ADMINISTRATIVAS (Apenas Admin) ---
router.use(isAdmin);

router.post('/users', validate(createUserSchema), createUser);
router.put('/users/:id', validate(updateUserSchema), updateUser);
router.delete('/users/:id', deleteUser);

export default router;
