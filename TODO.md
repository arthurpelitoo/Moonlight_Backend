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
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d 
'{"nome_usuario":"João",
"email_usuario":"joao@test.com",
"senha_usuario":"Abc1@Defg",
"cpf_usuario":"12345678901"}'





