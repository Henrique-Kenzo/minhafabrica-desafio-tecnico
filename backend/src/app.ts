import express from 'express';
import cors from 'cors';
import 'dotenv/config'; 
import apiRoutes from './routes/index';
import { globalErrorHandler } from './middlewares/error.middleware';
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

app.use('/api/v1', apiRoutes);

app.use(globalErrorHandler); 

export default app;
