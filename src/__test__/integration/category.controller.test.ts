import request from 'supertest';
import app from '../../servers/server.js';

let adminToken: string;
let createdCategoryId: number;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'juizei@gmail.com', password: 'Qwert678' });
  adminToken = res.body.token;
});

describe('Category Controller', () => {

  describe('GET /api/categories/', () => {
    it('should return all categories', async () => {
      const res = await request(app)
        .get('/api/categories/')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/categories/pag', () => {
    it('should return paginated categories', async () => {
      const res = await request(app)
        .get('/api/categories/pag?page=1&limit=8')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
    });

    it('should filter by name', async () => {
      const res = await request(app)
        .get('/api/categories/pag?name=acao')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should return 400 for invalid id', async () => {
      const res = await request(app)
        .get('/api/categories/abc')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(400);
    });

    it('should return 404 for non-existent category', async () => {
      const res = await request(app)
        .get('/api/categories/999999')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /api/categories/', () => {
    it('should return 400 if missing required fields', async () => {
      const res = await request(app)
        .post('/api/categories/')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Sem descricao' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('nome e descrição são obrigatórios');
    });

    it('should create category successfully', async () => {
      const res = await request(app)
        .post('/api/categories/')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: `Categoria Teste ${Date.now()}`,
          description: 'Descrição da categoria teste',
          image: 'https://exemplo.com/img.png'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id_category');
      createdCategoryId = res.body.id_category;
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should return 400 if missing required fields', async () => {
      const res = await request(app)
        .put(`/api/categories/${createdCategoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Sem descricao' });
      expect(res.statusCode).toBe(400);
    });

    it('should update category successfully', async () => {
      const res = await request(app)
        .put(`/api/categories/${createdCategoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Categoria Atualizada',
          description: 'Descrição atualizada',
          image: 'https://exemplo.com/nova-img.png'
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Categoria atualizada com sucesso!');
    });

    it('should return 404 for non-existent category', async () => {
      const res = await request(app)
        .put('/api/categories/999999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Fantasma', description: 'Não existe' });
      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete category successfully', async () => {
      const res = await request(app)
        .delete(`/api/categories/${createdCategoryId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Categoria deletada com sucesso!');
    });

    it('should return 404 for non-existent category', async () => {
      const res = await request(app)
        .delete('/api/categories/999999')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(404);
    });
  });
});