import { Router } from 'express';
import { login, seed } from '../controllers/auth.controller';
import { getDashboard } from '../controllers/dashboard.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/auth/seed', seed);

router.post('/auth/login', login);

router.use(verifyToken);
router.get('/dashboard', getDashboard);

export default router;
