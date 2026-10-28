# Remoção da coluna `type` de `user`

**Status:** Aceito
**Data:** 2026-10-28

## Contexto
`type` ('customer'|'admin') foi mantido temporariamente enquanto as
rotas migravam para RBAC. Todas as rotas agora usam `roleMiddleware`
e o token carrega `roles`, então `type` virou fonte duplicada de verdade.

## Decisão
Remover a coluna via migration, no mesmo commit que remove seus
últimos usos no código e no seed.

## Consequências
Papel do usuário existe só em `user_roles`. A remoção não tem
rollback;
