import request from 'supertest';
import app from '../../servers/server.js';

let adminToken: string;
let createdGameId: number;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'juizei@gmail.com', password: 'Qwert678' });
  adminToken = res.body.token;
});

describe('Game Controller', () => {

  describe('GET /api/games/', () => {
    it('should return all games', async () => {
      const res = await request(app)
        .get('/api/games/')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/games/pag', () => {
    it('should return paginated games', async () => {
      const res = await request(app)
        .get('/api/games/pag?page=1&limit=8')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
    });

    it('should filter by title', async () => {
      const res = await request(app)
        .get('/api/games/pag?title=test')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
    });
  });

  describe('GET /api/games/:id', () => {
    it('should return 400 for invalid id', async () => {
      const res = await request(app)
        .get('/api/games/abc')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(400);
    });

    it('should return 404 for non-existent game', async () => {
      const res = await request(app)
        .get('/api/games/999999')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /api/games/', () => {
    it('should return 400 if missing required fields', async () => {
      const res = await request(app)
        .post('/api/games/')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Sem preco' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('titulo, preço, data de lançamento e ativo são obrigatórios');
    });

    it('should create a game successfully', async () => {
      const res = await request(app)
        .post('/api/games/')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: `Jogo Teste ${Date.now()}`,
          description: 'Descrição do jogo teste',
          price: 59.99,
          launch_date: '2024-01-01',
          active: true,
          categories: []
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id_game');
      createdGameId = res.body.id_game;
    });
  });

  describe('PUT /api/games/:id', () => {
    it('should return 400 if missing required fields', async () => {
      const res = await request(app)
        .put(`/api/games/${createdGameId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Sem preco' });
      expect(res.statusCode).toBe(400);
    });

    it('should update game successfully', async () => {
      const res = await request(app)
        .put(`/api/games/${createdGameId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Jogo Atualizado',
          price: 49.99,
          launch_date: '2024-06-01',
          active: true,
          categories: []
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Jogo atualizado com sucesso!');
    });

    it('should return 404 for non-existent game', async () => {
      const res = await request(app)
        .put('/api/games/999999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Fantasma',
          price: 10,
          launch_date: '2024-01-01',
          active: false,
          categories: []
        });
      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/games/:id', () => {
    it('should delete game successfully', async () => {
      const res = await request(app)
        .delete(`/api/games/${createdGameId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Jogo deletado com sucesso!');
    });

    it('should return 404 for non-existent game', async () => {
      const res = await request(app)
        .delete('/api/games/999999')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(404);
    });
  });
});