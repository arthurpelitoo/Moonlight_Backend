import request from "supertest";
import app from "../../servers/server.js";

let adminToken: string;
let createdGameId: number;

beforeAll(async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "dominic@familia.com", password: "Familia123" });
  adminToken = res.body.token;
});

describe("Game Controller", () => {
  describe("GET /api/games/", () => {
    it("deve retornar todos os jogos", async () => {
      const res = await request(app)
        .get("/api/games/")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /api/games/pag", () => {
    it("deve retornar jogos paginados", async () => {
      const res = await request(app)
        .get("/api/games/pag?page=1&limit=8")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
    });

    it("deve filtrar por título", async () => {
      const res = await request(app)
        .get("/api/games/pag?title=test")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
    });
  });

  describe("GET /api/games/:id", () => {
    it("deve retornar 400 para id inválido", async () => {
      const res = await request(app)
        .get("/api/games/abc")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(400);
    });

    it("deve retornar 404 para jogo inexistente", async () => {
      const res = await request(app)
        .get("/api/games/999999")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe("POST /api/games/", () => {
    it("deve retornar 400 se faltar campos obrigatórios", async () => {
      const res = await request(app)
        .post("/api/games/")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ title: "Sem preco" });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe(
        "Campos inválidos de Create ou Update de Jogo",
      );
    });

    it("deve criar jogo com sucesso e capturar id para próximos testes", async () => {
      const uniqueName = `Jogo Teste ${Date.now()}`;
      const res = await request(app)
        .post("/api/games/")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: uniqueName,
          description: "Descrição do jogo teste",
          price: 59.99,
          launch_date: "2024-01-01",
          active: true,
          categories: [],
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message");
      // busca pelo nome único para pegar o id
      const listRes = await request(app)
        .get(`/api/games/pag?title=${encodeURIComponent(uniqueName)}`)
        .set("Authorization", `Bearer ${adminToken}`);

      createdGameId = listRes.body.data[0].id_game;
    });
  });

  describe("PUT /api/games/:id", () => {
    it("deve retornar 400 se faltar campos obrigatórios", async () => {
      const res = await request(app)
        .put(`/api/games/${createdGameId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ title: "Sem preco" });
      expect(res.statusCode).toBe(400);
    });

    it("deve atualizar jogo com sucesso", async () => {
      const res = await request(app)
        .put(`/api/games/${createdGameId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "Jogo Atualizado",
          price: 49.99,
          launch_date: "2024-06-01",
          active: true,
          categories: [],
        });
      expect(res.body.message).toBe("Jogo atualizado com sucesso!");
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Jogo atualizado com sucesso!");
    });

    it("deve retornar 404 para jogo inexistente", async () => {
      const res = await request(app)
        .put("/api/games/999999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "Fantasma",
          price: 10,
          launch_date: "2024-01-01",
          active: false,
          categories: [],
        });
      expect(res.statusCode).toBe(404);
    });
  });

  describe("DELETE /api/games/:id", () => {
    it("deve deletar jogo com sucesso", async () => {
      const res = await request(app)
        .delete(`/api/games/${createdGameId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Jogo deletado com sucesso!");
    });

    it("deve retornar 404 para jogo inexistente", async () => {
      const res = await request(app)
        .delete("/api/games/999999")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(404);
    });
  });
});
