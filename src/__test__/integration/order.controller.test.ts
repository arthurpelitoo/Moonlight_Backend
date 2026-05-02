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

describe('Order Controller', () => {
  describe('GET /api/orders/', () => {
    it('should return all orders', async () => {
      const res = await request(app)
        .get('/api/orders/')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
    });
  });

  describe('POST /api/orders/', () => {
    it('should create order', async () => {
      const res = await request(app)
        .post('/api/orders/')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          total: 100,
          preference_id: 'pref123',
          external_reference: 'ref123',
          status: 'pending'
        });
      expect(res.statusCode).toBe(201);
    });

    it('should fail with invalid total', async () => {
      const res = await request(app)
        .post('/api/orders/')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          total: -10,
          preference_id: 'pref123',
          external_reference: 'ref123',
          status: 'pending'
        });
      expect(res.statusCode).toBe(400);
    });
  });
});
afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
});