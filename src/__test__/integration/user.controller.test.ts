import request from 'supertest';
import app from '../../servers/server.js';

let adminToken: string;
let createdUserId: number;

const VALID_CPF = '744.846.070-69';
const VALID_PASSWORD = 'Abc12345';

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'dominic@familia.com', password: 'Familia123' });
  adminToken = res.body.token;
});

afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
});

describe('User Controller', () => {

  describe('GET /api/users/', () => {
    it('deve retornar todos os usuários', async () => {
      const res = await request(app)
        .get('/api/users/')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app).get('/api/users/');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/users/pag', () => {
    it('deve retornar usuários paginados', async () => {
      const res = await request(app)
        .get('/api/users/pag?page=1&limit=5')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
    });

    it('deve filtrar por nome', async () => {
      const res = await request(app)
        .get('/api/users/pag?name=dominic')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
    });
  });

  describe('GET /api/users/:id', () => {
    it('deve retornar usuário pelo id', async () => {
      const res = await request(app)
        .get('/api/users/1')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
    });

    it('deve retornar 400 para id inválido', async () => {
      const res = await request(app)
        .get('/api/users/abc')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(400);
    });

    it('deve retornar 404 para usuário inexistente', async () => {
      const res = await request(app)
        .get('/api/users/999999')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(404);
    });

    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app).get('/api/users/1');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/users/', () => {
    it('deve criar usuário com sucesso e capturar id para próximos testes', async () => {
      const uniqueEmail = `teste${Date.now()}@email.com`;

      const res = await request(app)
        .post('/api/users/')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Teste',
          email: uniqueEmail,
          password: VALID_PASSWORD,
          cpf: VALID_CPF,
          type: 'customer',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Usuário criado com sucesso!');

      // busca pelo email para capturar o id
      const listRes = await request(app)
        .get(`/api/users/pag?email=${encodeURIComponent(uniqueEmail)}`)
        .set('Authorization', `Bearer ${adminToken}`);

      createdUserId = listRes.body.data[0].id_user;
    });

    it('deve retornar 400 se faltar campos obrigatórios', async () => {
      const res = await request(app)
        .post('/api/users/')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
      expect(res.statusCode).toBe(400);
    });

    it('deve retornar 400 para senha fraca', async () => {
      const res = await request(app)
        .post('/api/users/')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Teste',
          email: `teste${Date.now()}@email.com`,
          password: 'fraca',
          cpf: VALID_CPF,
          type: 'customer',
        });
      expect(res.statusCode).toBe(400);
    });

    it('deve retornar 400 para CPF inválido', async () => {
      const res = await request(app)
        .post('/api/users/')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Teste',
          email: `teste${Date.now()}@email.com`,
          password: VALID_PASSWORD,
          cpf: '000.000.000-00',
          type: 'customer',
        });
      expect(res.statusCode).toBe(400);
    });

    it('deve retornar 409 para email já cadastrado', async () => {
      const res = await request(app)
        .post('/api/users/')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Dominic',
          email: 'dominic@familia.com',
          password: VALID_PASSWORD,
          cpf: VALID_CPF,
          type: 'customer',
        });
      expect(res.statusCode).toBe(409);
    });

    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app)
        .post('/api/users/')
        .send({ name: 'X', email: 'x@x.com', password: VALID_PASSWORD, cpf: VALID_CPF, type: 'customer' });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('PUT /api/users/:id (admin)', () => {
    it('deve atualizar usuário com sucesso', async () => {
      const res = await request(app)
        .put(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Atualizado',
          email: `atualizado${Date.now()}@email.com`,
          password: VALID_PASSWORD,
          cpf: VALID_CPF,
          type: 'customer',
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Usuário atualizado com sucesso!');
    });

    it('deve retornar 400 para id inválido', async () => {
      const res = await request(app)
        .put('/api/users/abc')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'X', email: 'x@x.com', password: VALID_PASSWORD, cpf: VALID_CPF, type: 'customer' });
      expect(res.statusCode).toBe(400);
    });

    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app)
        .put(`/api/users/${createdUserId}`)
        .send({ name: 'X', email: 'x@x.com', password: VALID_PASSWORD, cpf: VALID_CPF, type: 'customer' });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('PUT /api/users/me', () => {
    it('deve atualizar o próprio perfil com sucesso', async () => {
      const res = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'DominicTorresmo',
          password: "Familia123",
          cpf: VALID_CPF,
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Usuário editado com sucesso!');
      expect(res.body).toHaveProperty('user');
    });

    it('deve retornar 400 para senha fraca', async () => {
      const res = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Dominic', password: 'fraca', cpf: VALID_CPF });
      expect(res.statusCode).toBe(400);
    });

    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app)
        .put('/api/users/me')
        .send({ name: 'DominicTorresmo', password: VALID_PASSWORD, cpf: VALID_CPF });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/users/:id (admin)', () => {
    it('deve deletar usuário com sucesso', async () => {
      const res = await request(app)
        .delete(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Usuário deletado com sucesso!');
    });

    it('deve retornar 404 para usuário inexistente', async () => {
      const res = await request(app)
        .delete('/api/users/999999')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(404);
    });

    it('deve retornar 400 para id inválido', async () => {
      const res = await request(app)
        .delete('/api/users/abc')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(400);
    });

    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app).delete('/api/users/1');
      expect(res.statusCode).toBe(401);
    });
  });
});
