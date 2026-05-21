import request from 'supertest';
import app from '../../servers/server.js';

let adminToken: string;
let userToken: string;

beforeAll(async () => {
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: "dominic@familia.com", password: "Familia123" });
  adminToken = adminRes.body.token;

  // Use um usuário comum se tiver, senão o mesmo admin serve para rotas de usuário logado
  userToken = adminToken;
});

afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
});

describe('Order Controller', () => {

  describe('GET /api/orders/', () => {
    it('deve retornar todos os pedidos', async () => {
      const res = await request(app)
        .get('/api/orders/')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app).get('/api/orders/');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/orders/my-orders', () => {
    it('deve retornar os pedidos do usuário logado', async () => {
      const res = await request(app)
        .get('/api/orders/my-orders')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
    });

    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app).get('/api/orders/my-orders');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/orders/my-library', () => {
    it('deve retornar a biblioteca do usuário logado', async () => {
      const res = await request(app)
        .get('/api/orders/my-library')
        .set('Authorization', `Bearer ${userToken}`);
      expect([200, 404]).toContain(res.statusCode); // 404 se biblioteca vazia
    });

    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app).get('/api/orders/my-library');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/orders/can-user-purchase', () => {
    it('deve retornar se o usuário pode comprar o jogo', async () => {
      const res = await request(app)
        .get('/api/orders/can-user-purchase?id_game=1')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('canPurchase');
      expect(typeof res.body.canPurchase).toBe('boolean');
    });

    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app).get('/api/orders/can-user-purchase?id_game=1');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('deve retornar 404 para pedido inexistente', async () => {
      const res = await request(app)
        .get('/api/orders/999999')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(404);
    });

    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app).get('/api/orders/1');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/orders/', () => {
    it('deve criar pedido com sucesso', async () => {
      const res = await request(app)
        .post('/api/orders/')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          total: 100,
          preference_id: 'pref123',
          external_reference: `ref_${Date.now()}`,
          status: 'pending',
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Pedido criado com sucesso!');
    });

    it('deve retornar 400 para total inválido', async () => {
      const res = await request(app)
        .post('/api/orders/')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          total: -10,
          preference_id: 'pref123',
          external_reference: 'ref_invalido',
          status: 'pending',
        });
      expect(res.statusCode).toBe(400);
    });

    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app)
        .post('/api/orders/')
        .send({ total: 100, preference_id: 'pref123', external_reference: 'ref123', status: 'pending' });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('PUT /api/orders/:id', () => {
    it('deve retornar 404 para pedido inexistente', async () => {
      const res = await request(app)
        .put('/api/orders/999999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'approved', external_reference: 'ref_inexistente' });
      expect(res.statusCode).toBe(404);
    });

    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app)
        .put('/api/orders/1')
        .send({ status: 'approved', external_reference: 'ref123' });
      expect(res.statusCode).toBe(401);
    });
  });
});
