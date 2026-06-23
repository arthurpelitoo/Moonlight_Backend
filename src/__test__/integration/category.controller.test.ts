import request from "supertest";
import app from "../../servers/server.js";

let adminToken: string;
let createdCategoryId: number;

beforeAll(async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "dominic@familia.com", password: "Familia123" });
  adminToken = res.body.token;
});

describe("Category Controller", () => {
  describe("GET /api/categories/", () => {
    it("Deve retornar todas as categorias", async () => {
      const res = await request(app)
        .get("/api/categories/")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /api/categories/pag", () => {
    it("Deve retornar categorias paginadas", async () => {
      const res = await request(app)
        .get("/api/categories/pag?page=1&limit=8")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
    });

    it("Deveria filtrar por nome", async () => {
      const res = await request(app)
        .get("/api/categories/pag?name=acao")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
    });
  });

  describe("GET /api/categories/:id", () => {
    it("Deveria retornar status 400 por id invalido", async () => {
      const res = await request(app)
        .get("/api/categories/abc")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(400);
    });

    it("Deveria retornar status 404 pela categoria inexistente", async () => {
      const res = await request(app)
        .get("/api/categories/999999")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe("POST /api/categories/", () => {
    it("Deveria retornar status 400 por faltar campos obrigatórios", async () => {
      const res = await request(app)
        .post("/api/categories/")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Sem descricao" });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe(
        "Campos inválidos de Create ou Update de Jogo",
      );
    });

    it("Deveria criar categoria com sucesso e capturar id para próximos testes", async () => {
      const uniqueName = `Categoria Teste ${Date.now()}`;
      const res = await request(app)
        .post("/api/categories/")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: uniqueName,
          description: "Descrição da categoria teste",
          image: "https://exemplo.com/img.png",
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message");

      // busca pelo nome único para pegar o id
      const listRes = await request(app)
        .get(`/api/categories/pag?name=${encodeURIComponent(uniqueName)}`)
        .set("Authorization", `Bearer ${adminToken}`);

      createdCategoryId = listRes.body.data[0].id_category;
    });
  });

  describe("PUT /api/categories/:id", () => {
    it("Deveria retornar status 400 por faltar campos obrigatórios", async () => {
      const res = await request(app)
        .put(`/api/categories/${createdCategoryId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Sem descricao" });
      expect(res.statusCode).toBe(400);
    });

    it("Deveria atualizar categoria com sucesso", async () => {
      const res = await request(app)
        .put(`/api/categories/${createdCategoryId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Categoria Atualizada",
          description: "Descrição atualizada",
          image: "https://exemplo.com/nova-img.png",
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Categoria atualizada com sucesso!");
    });

    it("Deveria retornar status 404 pela categoria inexistente", async () => {
      const res = await request(app)
        .put("/api/categories/999999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Fantasma", description: "Não existe" });
      expect(res.statusCode).toBe(404);
    });
  });

  describe("DELETE /api/categories/:id", () => {
    it("Deveria deletar categoria com sucesso", async () => {
      const res = await request(app)
        .delete(`/api/categories/${createdCategoryId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Categoria deletada com sucesso!");
    });

    it("Deveria retornar status 404 pela categoria inexistente", async () => {
      const res = await request(app)
        .delete("/api/categories/999999")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(404);
    });
  });
});
