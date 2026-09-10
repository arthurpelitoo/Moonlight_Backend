# Transação obrigatória quando uma regra de consistência cruza mais de uma tabela

**Status:** Aceito
**Data:** 2026-09-06

## Contexto
Algumas operações de escrita afetam mais de uma tabela sob uma
mesma regra de negócio (ex: jogo + suas categorias, usuário + role
+ versão do token). Sem transação, uma falha no meio do processo
deixa o sistema num estado que a própria regra de negócio proíbe.

## Decisão
Toda operação de service que grava em mais de uma tabela, onde as
tabelas precisam estar sincronizadas para o dado fazer sentido,
usa connection.beginTransaction()/commit()/rollback() explicitamente,
seguindo o padrão já usado em GameService.create/update. Leitura
pura e escrita de tabela única não precisam de transação.

## Consequências
Exige revisão dos serviços existentes que ainda não seguem esse
padrão (ex: CheckoutService.createPreference, que hoje cria order e
purchased_items sem transação amarrando os dois — candidato a
correção). Serve como critério objetivo para decidir, caso a
caso, se uma nova função de service precisa de transação.
