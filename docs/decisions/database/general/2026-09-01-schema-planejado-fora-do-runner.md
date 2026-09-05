# Schema planejado (não implementado) fica em database/planned/, fora do runner de migrations

**Status:** Aceito
**Data:** 2026-09-01

## Contexto
O DER expandido (v3) inclui tabelas e alterações que só serão
implementadas no próximo semestre. Deixá-las dentro de
database/migrations/ arriscaria serem aplicadas prematuramente,
já que o runner de migrations lê e executa todo arquivo pendente
naquela pasta.

## Decisão
Schema planejado mas não implementado fica em database/planned/,
fora do escopo lido pelo script de migration. Quando a implementação
realmente começar, o arquivo é movido para database/migrations/ com
nome datado, passando a seguir a regra normal de migration aplicada
(nunca mais editado depois disso).

## Consequências
Planejamento de longo prazo fica versionado e pronto para uso, sem
risco de execução acidental. Arquivos em planned/ podem ser editados
livremente até o momento da migração de verdade, diferente de
migrations já aplicadas.
