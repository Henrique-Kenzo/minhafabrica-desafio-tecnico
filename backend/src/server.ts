import mongoose from 'mongoose';
import app from './app';

const PORT = process.env.PORT || 3001;

const MONGODB_URI = process.env.MONGODB_URI as string;

console.log('Conectando ao Banco de Dados...');

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB Conectado Mongoose com Sucesso!');
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando a todo vapor em http://localhost:${PORT}/api/v1`);
    });
  })
  .catch((err) => {
    console.error('Erro fatal ao conectar no MongoDB:', err);
    process.exit(1);
  });
