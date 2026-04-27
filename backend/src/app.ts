import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';


import apiRoutes from './routes/index';
import { globalErrorHandler } from './middlewares/error.middleware';

const app = express();

// Health check — fora do rate limiter p/ keep-alive do Render
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 150,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/v1/', apiLimiter);

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));

app.use(express.json({ limit: '10mb' }));

app.use('/api/v1', apiRoutes);

app.use(globalErrorHandler);

export default app;
