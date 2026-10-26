# Pool de conexão sempre injetado no construtor do service, nunca importado direto

**Status:** Aceito
**Data:** 2026-09-10

## Contexto
UserService importava `pool` diretamente de config/database.js dentro
dos métodos que abrem transação, em vez de recebê-lo via construtor.
Isso fez testes unitários abrirem conexão real com o MySQL, mesmo
mockando repository/service — o pool nunca foi mockável.

## Decisão
Todo service que abre transação (getConnection/beginTransaction)
recebe `pool: Pool` como dependência injetada no construtor, nunca
via import direto do módulo de config. Segue o padrão já usado em
GameService.

## Consequências
Testes unitários passam a mockar o pool como qualquer outra
dependência, eliminando conexão real durante `npm test`. Exige
revisar outros services (CheckoutService, OrderService) para
confirmar que nenhum ainda importa pool diretamente.
