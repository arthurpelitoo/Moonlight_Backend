import request from 'supertest';
import app from '../../servers/server.js';

let adminToken: string;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'juizei@gmail.com', password: 'Qwert678' });
  adminToken = res.body.token;
});

afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
});

describe('User Controller', () => {
  describe('GET /api/users/', () => {
    it('should return all users', async () => {
      const res = await request(app)
        .get('/api/users/')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by id', async () => {
      const res = await request(app)
        .get('/api/users/1')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
    });

    it('should return 404 if user not found', async () => {
      const res = await request(app)
        .get('/api/users/999999')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /api/users/', () => {
    it('should create user successfully', async () => {
      const res = await request(app)
        .post('/api/users/')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Teste',
          email: `teste${Date.now()}@email.com`,
          password: 'Strong123',
          cpf: '74484607069',
          type: 'customer'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id_user');
    });

    it('should fail if missing fields', async () => {
      const res = await request(app)
        .post('/api/users/')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
      expect(res.statusCode).toBe(400);
    });
  });
});