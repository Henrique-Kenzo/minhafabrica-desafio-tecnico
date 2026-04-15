import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI as string;
    
    // Fallback de segurança para alertar caso falte o .env
    if (!MONGODB_URI) {
      throw new Error('A variável MONGODB_URI não está definida no arquivo .env');
    }

    console.log('Conectando ao Banco de Dados...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Conectado com Sucesso!');
  } catch (error) {
    console.error('Erro fatal ao conectar no MongoDB:', error);
    process.exit(1);
  }
};
