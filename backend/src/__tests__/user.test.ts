import request from 'supertest';
import app from '../app';
import { describe, it, expect, beforeAll, beforeEach } from '@jest/globals';

let token: string;
let createdUserId: string;

describe('User Tests', () => {
  beforeEach(async () => {
    await request(app).post('/api/v1/auth/seed');
    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: process.env.ADMIN_EMAIL || 'admin@minhafabrica.com', password: process.env.ADMIN_PASSWORD || 'senha123' });
    token = login.body.token;
  });

  it('should create a new common user as admin', async () => {
    const res = await request(app).post('/api/v1/users').set('Authorization', `Bearer ${token}`).send({
      name: 'Common User',
      email: 'common@test.com',
      password: 'password123',
      role: 'user'
    });
    expect(res.status).toBe(201);
    createdUserId = res.body._id;
  });

  it('should reject invalid user creation', async () => {
    const res = await request(app).post('/api/v1/users').set('Authorization', `Bearer ${token}`).send({
      name: 'Common User',
      email: 'not-an-email',
      password: '',
      role: 'user'
    });
    expect(res.status).toBe(400);
  });

  it('should fail finding users without admin role if user tries (mocking user try by removing admin status)', async () => {
    const loginCommon = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'common@test.com', password: 'password123' });
    
    expect(loginCommon.status).toBe(200);
    const userToken = loginCommon.body.token;

    const res = await request(app).get('/api/v1/users').set('Authorization', `Bearer ${userToken}`);
    expect([401, 403]).toContain(res.status);
  });

  it('should list all users to admin', async () => {
    const res = await request(app).get('/api/v1/users').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should update user', async () => {
    const res = await request(app).put(`/api/v1/users/${createdUserId}`).set('Authorization', `Bearer ${token}`).send({
      name: 'Common Updated'
    });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Common Updated');
  });

  it('should fail update with invalid id/body', async () => {
    const res = await request(app).put(`/api/v1/users/brokenid`).set('Authorization', `Bearer ${token}`).send({});
    expect([500, 400]).toContain(res.status);
  });

  it('should delete user', async () => {
    const res = await request(app).delete(`/api/v1/users/${createdUserId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});
