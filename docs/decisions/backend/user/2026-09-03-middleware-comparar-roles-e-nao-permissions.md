# Middleware compara nome de role, não resource:action resolvido de permission

**Status:** Aceito
**Data:** 2026-09-02

## Contexto
O RBAC modelado (role, permission, user_roles, role_permissions)
permite granularidade resource:action editável via dado. Na
prática, o projeto tem apenas 3 roles fixas (admin, customer,
studio) sem interface de edição de permissões — decisão já tomada
anteriormente de deixar o editor visual para trabalho futuro. Nesse
cenário, cada rota já define estaticamente, no próprio código, qual
resource+action ela representa — a resolução via tabela em tempo
de execução não agrega valor que não exista já no roteamento.

## Decisão
O middleware de autorização compara o nome da role do usuário
(`requireRole('admin', 'studio')`) diretamente, sem consultar
`permission`/`role_permissions` em tempo de execução. O que uma
role pode fazer passa a ser definido pelas rotas decoradas no
código, não por dado. `role_version` (renomeado de
`permission_version`) invalida o token quando um usuário ganha ou
perde uma role — não mais quando a definição de uma role muda,
já que isso agora é code-driven, versionado via deploy normal.

## Alternativas consideradas
Manter resolução via permission/role_permissions em tempo de
execução (design original). Descartado por adicionar complexidade
(JOIN em cada login, RolePermissionService dedicado) sem colher agora o
benefício que a justificaria (edição de permissão sem deploy), já
que essa funcionalidade foi explicitamente cortada do escopo por enquanto.

## Consequências
Menos código, menos pontos de falha, alinhado com a implementação
de referência do professor. As tabelas permission/role_permissions
permanecem no schema e no DER (valor didático de modelagem
relacional), mas não são consultadas pelo middleware — ficam
reservadas como extensibilidade futura caso um editor de permissões
seja implementado depois. Perde-se auditoria de "o que cada role
pode fazer" via SQL — essa informação passa a residir no código das
rotas.
