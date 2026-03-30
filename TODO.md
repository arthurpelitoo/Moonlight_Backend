# TODO: Implement User Edit Controller - COMPLETE ✅

## Plan Steps (Completed)
1. [x] Install dependencies: bcryptjs, jsonwebtoken, types.
2. [x] Create src/utils/validators.ts (CPF, password validation).
3. [x] Create src/middlewares/authMiddleware.ts (JWT verify).
4. [x] Update src/@types/index.d.ts (add req.user).
5. [x] Update src/controllers/userController.ts (fix import, add updateUser).
6. [x] Update src/routes/userRoutes.ts (add PUT route).
7. [x] Update src/servers/server.ts (add middleware, mount routes).
8. [x] Add .env example for JWT_SECRET.
9. [x] Ready for test: npm run dev

## Usage
- Copy .env.example to .env, set JWT_SECRET and DB creds.
- Run `npm run dev`
- GET /api/users - list users
- PUT /api/users/{your_id} - edit with Bearer {jwt_token}

User controller created with edit function fully implemented: authenticated, self-only, required fields, CPF validation, strong password, no email change.

---

# NOVO: Cadastro de Usuário (POST /api/users)

**Informações Reunidas:**
- Infra pronta (controller, validators, routes, bcrypt).
- Model IUser completo.
- Faltam validação email + unique check + INSERT.

**Plano (file level):**
1. Edit src/utils/validators.ts + `isValidEmail(email: string)` regex.
2. Edit src/controllers/userController.ts + `createUser` : validate, email unique SELECT COUNT(email), hash senha, INSERT (nivel_acesso='cliente').
3. Edit src/routes/userRoutes.ts + `router.post('/', createUser)` (public, no auth).
4. Edit TODO.md mark done.

**Dependent Files:**
- pool/database.ts OK.
- userRoutes.ts OK.

**Followup steps:**
- npm run dev
- Test POST curl.
- Opcional JWT token no response.

 Cadastro de Usuário - COMPLETE ✅

**Passos executados:**
1. [x] validators.ts + isValidEmail
2. [x] controller.ts + createUser (validate, unique email, hash, INSERT 'cliente')
3. [x] routes + POST / public
4. [x] TODO updated

**Teste POST:**
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"nome_usuario":"João","email_usuario":"joao@test.com","senha_usuario":"Abc1@Defg","cpf_usuario":"12345678901"}'





