# Paginação de usuários usa GROUP_CONCAT + EXISTS para roles, não JOIN direto

**Status:** Aceito
**Data:** 2026-09-08

## Contexto
findAllPaginated fazia JOIN direto com user_roles/role, multiplicando
linhas por usuário com múltiplas roles — quebrava LIMIT/OFFSET e
COUNT(*). Filtrar por role via WHERE na mesma junção também escondia
as demais roles do usuário no resultado agregado.

## Decisão
Roles são agregadas via LEFT JOIN + GROUP_CONCAT (mesmo padrão já
usado em GameRepository para categories). Filtro por role usa
subquery EXISTS separada, não a junção de exibição — assim a
filtragem não interfere no conjunto completo de roles retornado.

## Consequências
count() precisa espelhar exatamente a mesma lógica (DISTINCT +
EXISTS) para o total bater com os dados retornados. Busca textual
por nome continua via LIKE por ora; FULLTEXT index fica registrado
como melhoria futura, não necessária no volume atual de dados.
