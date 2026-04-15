import { Router } from 'express';
import { login, seed } from '../controllers/auth.controller';
import { getDashboard } from '../controllers/dashboard.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';
import { findAllUsers, createUser, updateUser, deleteUser } from '../controllers/user.controller';
import { findAllProducts, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';

const router = Router();

// --- 1. ROTAS PÚBLICAS ---
router.post('/auth/seed', seed);
router.post('/auth/login', login);

// --- 2. ROTAS PROTEGIDAS (Usuário Logado) ---
router.use(verifyToken);

router.get('/dashboard', getDashboard);
router.get('/users', findAllUsers);

router.get('/products', findAllProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// --- 3. ROTAS ADMINISTRATIVAS (Apenas Admin) ---
router.use(isAdmin);

router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
