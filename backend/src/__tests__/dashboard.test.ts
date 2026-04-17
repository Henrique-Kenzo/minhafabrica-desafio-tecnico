import request from 'supertest';
import app from '../app';
import { describe, it, expect, beforeAll, beforeEach } from '@jest/globals';

let token: string;

describe('Dashboard Tests', () => {
  beforeEach(async () => {
    await request(app).post('/api/v1/auth/seed');
    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: process.env.ADMIN_EMAIL || 'admin@minhafabrica.com', password: process.env.ADMIN_PASSWORD || 'senha123' });
    token = login.body.token;
  });

  it('should deny dashboard without token', async () => {
    const res = await request(app).get('/api/v1/dashboard');
    expect(res.status).toBe(401);
  });

  it('should deny dashboard with bad token', async () => {
    const res = await request(app).get('/api/v1/dashboard').set('Authorization', 'Bearer invalid_token');
    expect(res.status).toBe(401);
  });

  it('should get dashboard data mapped properly', async () => {
    const res = await request(app).get('/api/v1/dashboard').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('products');
    expect(res.body).toHaveProperty('users');
  });
});
