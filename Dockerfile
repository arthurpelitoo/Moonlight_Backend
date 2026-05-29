# ESTÁGIO 1: BUILD
# Typescript complia src/ e gera o /dist
FROM node:24.16.0-alpine3.23 AS builder
WORKDIR /app

# Copia só o package.json primeiro (otimiza cache do Docker)
# Se o código mudar mas as deps não, ele pula o npm ci
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

## ESTÁGIO 2: PRODUÇÃO
# Só /dist compilado + dependencias
# todo o resto descartado.

FROM node:24.16.0-alpine3.23
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/servers/server.js"]
