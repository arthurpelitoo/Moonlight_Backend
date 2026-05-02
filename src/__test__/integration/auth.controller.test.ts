import request from 'supertest';
import app from '../../servers/server.js';

afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
});

describe('AuthController - Integração', () => {

  describe('POST /api/auth/register', () => {
    it('deve retornar 400 se campos obrigatórios estiverem faltando', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Incompleto' });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('nome, email, senha e cpf são obrigatórios');
    });

    it('deve retornar 201 ao cadastrar usuário válido', async () => {
      const mockUser = {
        name: 'Fulano',
        email: `teste${Date.now()}@email.com`,
        password: 'Password123!',
        cpf: '529.982.247-25' // CPF matematicamente válido
      };
      const response = await request(app)
        .post('/api/auth/register')
        .send(mockUser);
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Usuário criado com sucesso!');
    });
  });

  describe('POST /api/auth/login', () => {
    it('deve retornar JWT e status 200 para login válido', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'juizei@gmail.com', password: 'Qwert678' });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
    });

    it('deve retornar 401 para senha incorreta', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'juizei@gmail.com', password: 'errada' });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Email ou senha inválidos');
    });
  });
});
