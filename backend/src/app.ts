import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';


import apiRoutes from './routes/index';
import { globalErrorHandler } from './middlewares/error.middleware';

const app = express();

// middlewares de seguranca
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(mongoSanitize());

// rate limit para evitar brute force
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 150,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/v1/', apiLimiter);

// habilitando cors
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));



// limitando tamanho do body (10mb para suportar imagens em base64)
app.use(express.json({ limit: '10mb' }));


// rotas principais
app.use('/api/v1', apiRoutes);

// handler global de erros
app.use(globalErrorHandler);

export default app;
