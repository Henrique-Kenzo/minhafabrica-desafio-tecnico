import mongoose from 'mongoose';
import 'dotenv/config';
import { ProductModel } from './models/product.model';

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/minhafabrica';

const productBlueprints = [
  { baseName: 'Headset', category: 'Eletrônicos', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
  { baseName: 'Câmera Compacta', category: 'Eletrônicos', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80' },
  { baseName: 'Tênis Esportivo', category: 'Moda', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
  { baseName: 'Tênis Casual', category: 'Moda', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80' },
  { baseName: 'Smartwatch', category: 'Eletrônicos', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80' },
  { baseName: 'Teclado Mecânico', category: 'Informática', image: 'https://images.unsplash.com/photo-1610438235354-a6ae5528385c?w=500&q=80' },
  { baseName: 'Mouse Gamer', category: 'Informática', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80' },
  { baseName: 'Cadeira Ergonômica', category: 'Móveis', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80' },
  { baseName: 'Óculos de Sol', category: 'Moda', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80' },
  { baseName: 'Mochila de Couro', category: 'Acessórios', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80' },
];

const adjectives = ['Pro', 'Max', 'Ultra', 'Premium', 'Elite', 'V2', 'Edition', 'Evolution'];

const generateProducts = () => {
  const products = [];
  
  for (let i = 0; i < 50; i++) {
    const blueprint = productBlueprints[i % productBlueprints.length];
    const modifier = adjectives[Math.floor(Math.random() * adjectives.length)];
    // Adiciona número ao nome para gerar registros únicos e visualmente fáceis de validar paginação
    const name = `${blueprint.baseName} ${modifier} ${Math.floor(Math.random() * 1000)}`;
    const price = Number((Math.random() * 800 + 49.9).toFixed(2));
    const stock = Math.floor(Math.random() * 100) + 5;
    
    products.push({
      name,
      description: `Excelência em ${blueprint.category}. O ${name} garante performance e estilo pro seu dia a dia. Produto certificado.`,
      price,
      stock,
      category: blueprint.category,
      imageUrl: blueprint.image
    });
  }
  return products;
}

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[INFO] Conectado ao MongoDB...');
    
    console.log('Limpando os produtos com nomes bizarros que geramos...');
    await ProductModel.deleteMany({ description: /Um incrível e moderno/ });
    await ProductModel.deleteMany({ description: /Excelência em/ }); 

    console.log('Montando 50 produtos COERENTES...');
    const data = generateProducts();
    
    await ProductModel.insertMany(data);
    
    console.log('[SUCCESS] Coerencia restaurada! 50 Produtos logicos inseridos no banco.');
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Erro gerando o Seed:', error);
    process.exit(1);
  }
}

seed();
