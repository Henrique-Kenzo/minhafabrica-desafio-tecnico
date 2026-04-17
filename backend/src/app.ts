import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';


import apiRoutes from './routes/index';
import { globalErrorHandler } from './middlewares/error.middleware';

const app = express();

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
