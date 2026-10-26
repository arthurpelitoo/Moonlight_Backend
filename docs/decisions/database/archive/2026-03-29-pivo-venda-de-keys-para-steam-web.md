# Pivô: de venda de chaves (estilo Nuuvem) para loja estilo Steam Web

**Status:** Aceito
**Data:** 2026-03-29

## Contexto
No final do semestre passado, ao retomar o projeto (antes feito em
PHP), pensamos em seguir a ideia antiga de um site de venda de
chaves de jogos, no estilo Nuuvem. O tempo disponível pra
desenvolver esse fluxo (estoque de chaves, entrega pós-compra) era curto.

## Decisão
Simplificar o modelo de negócio para uma loja com catálogo próprio
e curado, no estilo Steam Web — o usuário compra o jogo diretamente
da plataforma, sem o conceito de key/fornecedor terceiro.

## Alternativas consideradas
Manter o modelo de venda de keys de terceiros. Descartado: o fluxo
de compra completo (estoque, validação, entrega de key) não estaria
pronto a tempo, com risco real de entregar o projeto mais bugado.

## Consequências
Perdemos um modelo mais próximo do "mundo real" de revenda de
jogos, mas ganhamos um escopo executável dentro do prazo.

## Nota pessoal
Esse pivô ensinou a diminuir escopo e priorizar prazo/entrega —
lição que vale pra além desse projeto específico.
