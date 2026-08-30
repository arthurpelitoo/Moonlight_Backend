# Apagar `favorite` em prol de `wishlist`

**Status:** Aceito
**Data:** 2026-08-30

## Contexto
A tabela `favorite` (id_user, id_game, fav_star) foi criada antes da
expansão do modelo de dados que vem sendo planejada pro DER do
semestre. Ao revisar as features de engajamento do usuário, ficou
claro que `favorite` cobre o mesmo espaço conceitual que `wishlist`
(lista de jogos de interesse do usuário), sem trazer nada que
`wishlist` não resolva de forma mais simples.

## Decisão
Remover a tabela `favorite` via migration
(`20260830_1800_drop_favorite_table.sql`). A feature de lista de
desejos do usuário será reimplementada como `wishlist` no próximo
semestre, já dentro do modelo de dados expandido.

## Alternativas consideradas
Manter `favorite` e `wishlist` coexistindo como conceitos distintos
("curto esse jogo" vs. "quero comprar depois"). Descartado por ora:
adicionaria complexidade de produto sem uma necessidade concreta
identificada, e `wishlist` sozinha já cobre o caso de uso principal
com uma estrutura mais simples de implementar.

## Consequências
Perde-se o campo `fav_star` (não usado em nenhuma feature ativa no
momento da remoção). O código que referenciava `favorite`
(repository, service, rotas, e qualquer `LEFT JOIN` em queries de
`game`) precisa ser removido junto, senão o backend quebra ao
tentar consultar uma tabela inexistente. `wishlist` fica registrada
como trabalho futuro para o próximo semestre.
