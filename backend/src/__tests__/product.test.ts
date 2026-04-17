import request from 'supertest';
import app from '../app';
import { describe, it, expect, beforeAll, beforeEach } from '@jest/globals';

let token: string;

describe('Product Integration Tests', () => {
  beforeEach(async () => {
    // 1. Seed admin
    await request(app).post('/api/v1/auth/seed').send();

    // 2. Login admin
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: process.env.ADMIN_EMAIL || 'admin@minhafabrica.com', password: process.env.ADMIN_PASSWORD || 'senha123' });

    token = res.body.token;
  });

  describe('Monetary Paradigm Shift', () => {
    it('should create a product and store price multiplied by 100 as integer', async () => {
      // 100.35 in the payload
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Produto Teste Monetary',
          description: 'Validates cent-level manipulation',
          price: 100.35, 
          stock: 10,
          category: 'Teste'
        });

      expect(res.status).toBe(201);
      // The controller multiplies 100.35 * 100 = 10035
      expect(res.body.price).toBe(10035);
    });

    it('should update a product and manipulate price the same way', async () => {
      const createRes = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Produto Teste Update',
          description: 'Before update',
          price: 50.00, 
          stock: 5,
          category: 'Teste'
        });

      const productId = createRes.body._id;

      const updateRes = await request(app)
        .put(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          price: 89.99 
        });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.price).toBe(8999);
    });
  });

  describe('Cloudinary Decoupling Architecture', () => {
    it('should generate a valid cloudinary signature bypassing multer', async () => {
      const res = await request(app)
        .get('/api/v1/products/upload-signature')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('signature');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('cloudName');
      expect(typeof res.body.signature).toBe('string');
      // Must not be an image upload endpoint anymore
    });
  });
});
