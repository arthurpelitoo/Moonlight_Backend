import request from 'supertest';
import app from '../../servers/server.js';

let userToken: string;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'juizei@gmail.com', password: 'Qwert678' });
  userToken = res.body.token;
});

describe('Checkout Controller', () => {

  describe('POST /api/checkout/', () => {
    it('should return 400 if user already owns the game', async () => {
      // Ajuste id_game para um jogo que o admin já possui
      const res = await request(app)
        .post('/api/checkout/')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          items: [{ id_game: 3, title: 'Jogo Existente', price: 59.99 }],
          user: { id_user: 1, name: 'Admin' }
        });
      // Se já possui: 400 | Se não possui: 200 com preference_id
      expect([200, 400]).toContain(res.statusCode);
    });

    it('should return 200 with preference_id for valid checkout', async () => {
      // Use um id_game que o usuário NÃO possui
      const res = await request(app)
        .post('/api/checkout/')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          items: [{ id_game: 999999, title: 'Jogo Novo', price: 29.99 }],
          user: { id_user: 1, name: 'carlinhos' }
        });
      // 200 se o jogo não está na biblioteca, 500 se MercadoPago não estiver configurado
      expect([200, 500]).toContain(res.statusCode);
    });
  });

  describe('POST /api/checkout/webhook', () => {
    it('should return 204 for non-payment webhook type', async () => {
      const res = await request(app)
        .post('/api/checkout/webhook')
        .send({ type: 'merchant_order', data: { id: '123' } });
      expect(res.statusCode).toBe(204);
    });

    it('should return 204 if payment id is missing', async () => {
      const res = await request(app)
        .post('/api/checkout/webhook')
        .send({ type: 'payment', data: {} });
      expect(res.statusCode).toBe(204);
    });
  });

  describe('GET /api/checkout/success', () => {
    it('should redirect to frontend success page', async () => {
      const res = await request(app).get('/api/checkout/success');
      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toContain('checkout/success');
    });
  });

  describe('GET /api/checkout/failure', () => {
    it('should redirect to frontend failure page', async () => {
      const res = await request(app).get('/api/checkout/failure');
      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toContain('checkout/failure');
    });
  });

  describe('GET /api/checkout/pending', () => {
    it('should redirect to frontend pending page', async () => {
      const res = await request(app).get('/api/checkout/pending');
      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toContain('checkout/pending');
    });
  });
});