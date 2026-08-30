# Manter coluna `type` no `user` durante migração para RBAC

**Status:** Aceito
**Data:** 2026-08-29

## Contexto
O sistema de autorização está sendo migrado de um campo simples
(`type ENUM('customer','admin')`) para RBAC completo (role,
permission, user_roles, role_permissions). A migração das rotas
existentes será feita gradualmente, uma por vez.

## Decisão
Manter a coluna `type` no banco até que todas as rotas estejam
usando `requirePermission` baseado em RBAC. Um seed de usuário
admin de teste também continua usando `type='admin'` para
facilitar testes rápidos por outros desenvolvedores.

## Alternativas consideradas
Migrar tudo de uma vez e remover `type` imediatamente — descartado
por risco de quebrar rotas ainda não testadas com o novo sistema.

## Consequências
Dívida técnica temporária e intencional: duas fontes de "verdade"
de autorização coexistem por um tempo. `type` deve ser removido
assim que a migração de rotas terminar (ver ADR de remoção,
quando existir).
