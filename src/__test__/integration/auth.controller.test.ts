import request from "supertest";
import app from "../../servers/server.js";

let adminToken: string;
let createdUserId: number;

afterAll(async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
});

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'dominic@familia.com', password: 'Familia123' });
  adminToken = res.body.token;
});

const login = { email: "dominic@familia.com", password: "Familia123" };

describe("AuthController - Integração", () => {
  describe("POST /api/auth/register", () => {
    it("deve retornar 400 se campos obrigatórios estiverem faltando", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({ name: "Incompleto" });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Todos os campos são obrigatórios");
    });

    it("deve retornar 201 ao cadastrar usuário válido", async () => {
      const uniqueEmail = `teste${Date.now()}@email.com`;
      const mockUser = {
        name: "Fulano",
        email: uniqueEmail,
        password: "Password123!",
        cpf: "529.982.247-25",
      };
      const response = await request(app)
        .post("/api/auth/register")
        .send(mockUser);
      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Usuário registrado com sucesso!");

      // busca pelo email para capturar o id e deletar.
      const listRes = await request(app)
        .get(`/api/users/pag?email=${encodeURIComponent(uniqueEmail)}`)
        .set('Authorization', `Bearer ${adminToken}`);

      createdUserId = listRes.body.data[0].id_user;

      await request(app)
        .delete(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);
    });
  });

  describe("POST /api/auth/login", () => {
    it("deve retornar JWT e status 200 para login válido", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send(login);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(typeof response.body.token).toBe("string");
    });

    it("deve retornar 401 para senha incorreta", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "juizei@gmail.com", password: "Senha123Errada" });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Email ou senha inválidos");
    });
  });
});
