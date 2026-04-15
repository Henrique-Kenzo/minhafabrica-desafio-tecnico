import app from './app';
import { connectDB } from './config/database';

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Servidor rodando a todo vapor em http://localhost:${PORT}/api/v1`);
  });
};

startServer();
