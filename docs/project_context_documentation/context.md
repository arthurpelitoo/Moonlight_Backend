# Contexto do Projeto Moonlight

> Este arquivo existe para que qualquer pessoa (ou IA) que retome este
> projeto entenda rapidamente o estado atual, as decisões já tomadas
> e as convenções seguidas — sem precisar reconstruir esse contexto
> do zero a partir do histórico de conversas.

## O que é o Moonlight

Loja digital de jogos (estilo Steam), desenvolvida como projeto
semestral de faculdade. Backend em Node/Express/TypeScript com
MySQL (via `mysql2`, sem ORM), frontend web em React/Vite, app
mobile em Expo/React Native, tudo em repositórios separados
(backend, frontend web, mobile, devops).

### Origem e pivô de escopo

O projeto começou com a ideia de ser uma plataforma de venda de
chaves de jogos de terceiros (estilo Nuuvem), mas foi simplificado
para uma loja de catálogo próprio e curado (estilo Steam) por
restrição de tempo — ver
`docs/decisions/database/archive/2026-03-29-pivo-venda-de-keys-para-steam-web.md`.

## Prática de ADR (Architecture Decision Record) — leia isto primeiro

**Este projeto documenta decisões de arquitetura, design e código
("por que assim e não de outro jeito") como ADRs em `docs/decisions/`,
organizados por camada/domínio (ex: `backend/auth/`, `database/schema/`).**

Template usado:
```markdown
# Título curto da decisão

**Status:** Aceito | Proposto | Substituído por [link]
**Data:** AAAA-MM-DD

## Contexto
## Decisão
## Alternativas consideradas
## Consequências
```

Regra de escopo: ADR só é criado para decisões reais de modelagem,
arquitetura ou código com raciocínio de trade-off por trás — nunca
para correção de sintaxe, ajuste pontual ou clarificação simples.
**Qualquer IA ou dev continuando este projeto deve seguir essa
mesma prática ao tomar decisões dessa natureza.**

## Estado atual do schema (v2, implementado)

Tabelas em produção: `user`, `category`, `game`, `game_category`,
`order`, `purchased_items`, `price_audit`, `role`, `permission`,
`user_roles`, `role_permissions`.

Colunas relevantes em `user`: `type` (legado, mantido temporariamente
durante migração para RBAC), `role_version` (renomeada de
`permission_version`), `account_status`, `deletion_scheduled_at`.

Schema planejado mas não implementado (v3) fica em
`database/planned/`, fora do alcance do runner de migrations —
inclui `studio`, `game_media`, `review`, `wishlist`,
`refund_request`, `promotion`/`game_promotion`, `login_history`,
`payment_method`, e as colunas `game.review_status` /
`game.rejection_reason`.

## Decisões-chave já fechadas

- **RBAC deste semestre é role-based, não permission-granular.**
  O middleware (`roleMiddleware`) compara o nome da role no token
  JWT (`roles: string[]`), não resolve `resource:action` via
  `permission`/`role_permissions` em tempo de execução — essas
  tabelas continuam no schema (valor didático/DER) mas não são
  lidas pelo middleware. Granularidade fica para o próximo semestre.
- **`role_version`** invalida o token (força novo login) quando o
  vínculo usuário↔role muda — checado a cada requisição, efeito já
  na próxima chamada do usuário, sem esperar o token expirar (8h).
- **Admin sempre faz bypass** de qualquer checagem de role/permission.
- **`account_status`** (banido/suspenso) fica para o próximo
  semestre — decisão de escopo para reduzir superfície de UX a
  sincronizar entre web e mobile neste sprint.
- **Auditoria de preço via aplicação, não trigger** — `price_audit`
  deixa de depender de `CREATE TRIGGER` (risco em hosting
  restritivo) e passa a ser populada por `PriceAuditService`, com
  `altered_by_user` como FK (BIGINT) em vez de VARCHAR solto.
- **Promoção por ownership, sem aprovação e sem cap de desconto** —
  studio pode dar até 100% de desconto nos próprios jogos, admin em
  qualquer jogo; sem revisão manual por evento (ao contrário do
  fluxo de aprovação de jogo, que é único por publicação).
- **`developer`/`publisher` unificados em `studio`** — evita
  duplicar uma empresa que atua nos dois papéis (ex: Sega).
  `studio.id_owner_user` é nullable (maioria dos estúdios do
  catálogo não tem conta ativa na plataforma).
- **Upload de imagem é um endpoint genérico** (`POST /api/uploads`),
  desacoplado de `game` — o frontend sobe o arquivo primeiro, recebe
  uma URL, e manda essa URL como string normal ao criar/editar o
  recurso. Evita acoplar upload a uma entidade específica, essencial
  já que `game` tem múltiplos campos de imagem e ganhará N mídias
  (`game_media`) no futuro.
- **CPF obrigatório e Mercado Pago como gateway** são amarras
  regionais conscientes — internacionalização ficou registrada como
  ideia de roadmap distante, não escopo de nenhum semestre próximo.
- **Split de pagamento com estúdio** (revenue share por venda,
  como a comissão da Steam) é ideia de longo prazo via "Split de
  Pagamentos" nativo do Mercado Pago — não escopado ainda.

## Convenções de repositório

- **Migrations**: `database/migrations/`, nomeadas
  `AAAAMMDD_HHmm_descricao.sql`, nunca editadas após aplicadas —
  mudança posterior sempre vira uma nova migration.
- **Schema planejado (não implementado)**: `database/planned/`,
  fora do que o script de migration lê; só migra para
  `database/migrations/` quando a implementação realmente começa.
- **Seeds**: `database/seeds/`, separado de migrations — dado de
  demonstração/dev, re-executável, nunca contém dado estrutural
  (ex: seed de `role`/`permission` fica em migration, não em seed).
- **Runner de migration**: script próprio (`tools/migrate.ts`) usando
  o mesmo `pool` do `mysql2`, sem framework de ORM/migration.
- Camadas de código: `Controller → Service → Repository`, um arquivo
  por responsabilidade; métodos privados de "montagem"
  (ex: `mapCategories`) ficam no repository que os usa.

## Escopo deste semestre vs. próximo

Este semestre: RBAC role-based, upload seguro de imagem, app mobile
(Expo/React Native) espelhando o backend web.

Próximo semestre: granularidade de permission real, `studio`/fluxo
de aprovação de jogo, `review`, `wishlist`, `refund_request`,
`promotion`, `login_history`, anonimização de conta (LGPD),
`account_status` aplicado nas rotas.
