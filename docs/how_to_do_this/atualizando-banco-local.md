# Atualizando o banco de dados local (MySQL em Docker)

## Contexto

O container do MySQL roda isolado (`docker run` avulso), plugado a
um volume nomeado (`moonlight-mysql-data`). O volume persiste dado
entre reinícios e recriações do container, mas **nunca aplica
migrations sozinho** — isso é sempre um passo manual, rodando o
script do backend contra a porta exposta.

`docker-entrypoint-initdb.d` do MySQL só executa scripts de
inicialização quando o volume nasce **vazio** (primeira vez). Um
volume que já existe com dado nunca reexecuta isso, não importa
quantas vezes o container seja parado/recriado.

## Fluxo do dia a dia (banco já existe, só quero aplicar migration nova)

1. Garanta que o container está rodando:
   ```bash
   docker start moonlight-db
   ```
   (se ele não existir ainda, use o `docker run` original documentado
   no repo de devops)

2. Confirme que o `.env` do backend aponta para o banco certo:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=moonlight_user
   DB_PASSWORD=moonshinelightingsky
   DB_NAME=moonlight
   ```

3. No repositório do backend, rode:
   ```bash
   npm run migrate
   ```
   O script é idempotente (usa a tabela `schema_migrations` para
   saber o que já foi aplicado) — seguro de rodar quantas vezes
   quiser, só executa o que estiver pendente.

## Recriando o container (ex: trocar versão do MySQL, resetar config)

O volume nomeado sobrevive à remoção do container — dado preservado:

```bash
docker stop moonlight-db
docker rm moonlight-db
docker run -d \
    --name moonlight-db \
    -p 3306:3306 \
    -v moonlight-mysql-data:/var/lib/mysql \
    -e MYSQL_ROOT_PASSWORD=moonshinelightingsky123 \
    -e MYSQL_DATABASE=moonlight \
    -e MYSQL_USER=moonlight_user \
    -e MYSQL_PASSWORD=moonshinelightingsky \
    mysql:8
```

Depois disso, rode `npm run migrate` de novo — o schema já vem
intacto do volume, o script só confirma que está tudo aplicado (não
deveria haver nada pendente, a menos que uma migration nova tenha
sido adicionada nesse meio tempo).

## Resetando tudo do zero (apagar todo dado, inclusive de teste)

Aqui sim o volume precisa ser destruído de propósito:

```bash
docker stop moonlight-db
docker rm moonlight-db
docker volume rm moonlight-mysql-data
```

Depois, recria o container com o mesmo `docker run` de cima — como
o volume não existe mais, o MySQL nasce vazio de verdade. Em
seguida:

```bash
npm run migrate   # roda TODAS as migrations do zero
npm run seed      # popula dado de desenvolvimento (opcional)
```

## Verificando o estado sem adivinhar

Pra conferir quais migrations já foram aplicadas, sem precisar
adivinhar pelo volume:

```sql
SELECT * FROM schema_migrations ORDER BY applied_at;
```

Rode isso via DBeaver ou `docker exec -it moonlight-db mysql -u root -p`.
