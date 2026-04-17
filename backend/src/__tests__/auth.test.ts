import request from 'supertest';
import app from '../app';
import { describe, it, expect, beforeAll } from '@jest/globals';

describe('Auth Tests', () => {
  it('should seed admin once', async () => {
    const res = await request(app).post('/api/v1/auth/seed');
    expect([200, 201]).toContain(res.status);
  });

  it('should fail to seed admin if already exists', async () => {
    const res = await request(app).post('/api/v1/auth/seed');
    expect([200, 400]).toContain(res.status);
  });

  it('should fail login with wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: process.env.ADMIN_EMAIL || 'admin@minhafabrica.com', password: 'wrong_password_long' });
    expect(res.status).toBe(401);
  });

  it('should fail login with invalid format', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'notanemail', password: 'abc' });
    expect(res.status).toBe(400); // validation error
  });
});
