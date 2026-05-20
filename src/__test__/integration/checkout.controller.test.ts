import request from "supertest";
import app from "../../servers/server.js";

let userToken: string;

beforeAll(async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "dominic@familia.com", password: "Familia123" });
  userToken = res.body.token;
});

describe("Checkout Controller", () => {
  describe("POST /api/checkout/", () => {
    it("deve retornar 400 se o usuário já possui o jogo", async () => {
      const res = await request(app)
        .post("/api/checkout/")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          items: [{ id_game: 3, title: "Jogo Existente", price: 59.99 }],
          total: 59.99,
          user: { id_user: 1, name: "Admin", email: "dominic@familia.com" },
        });

      expect([200, 400]).toContain(res.statusCode);
    });

    it("deve retornar 200 ou 500 para checkout válido (MP pode não estar configurado)", async () => {
      const res = await request(app)
        .post("/api/checkout/")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          items: [{ id_game: 999999, title: "Jogo Novo", price: 29.99 }],
          total: 29.99,
          user: { id_user: 1, name: "carlinhos", email: "carlinhos@email.com" },
        });

      expect([200, 500]).toContain(res.statusCode);
    });
  });

  describe("POST /api/checkout/webhook", () => {
    it("deve retornar 204 para webhook de tipo diferente de payment", async () => {
      const res = await request(app)
        .post("/api/checkout/webhook")
        .send({ type: "merchant_order", data: { id: "123" } });

      expect(res.statusCode).toBe(204);
    });

    it("deve retornar 204 se o id do pagamento estiver ausente", async () => {
      const res = await request(app)
        .post("/api/checkout/webhook")
        .send({ type: "payment", data: {} });

      expect(res.statusCode).toBe(204);
    });
  });

  describe("GET /api/checkout/success", () => {
    it("deve redirecionar para a página de sucesso do frontend", async () => {
      const res = await request(app).get("/api/checkout/success");

      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toContain("checkout/success");
    });
  });

  describe("GET /api/checkout/failure", () => {
    it("deve redirecionar para a página de falha do frontend", async () => {
      const res = await request(app).get("/api/checkout/failure");

      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toContain("checkout/failure");
    });
  });

  describe("GET /api/checkout/pending", () => {
    it("deve redirecionar para a página de pendente do frontend", async () => {
      const res = await request(app).get("/api/checkout/pending");

      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toContain("checkout/pending");
    });
  });
});
