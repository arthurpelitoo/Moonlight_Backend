# Promoção criada por ownership (studio ou admin), sem aprovação por evento

**Status:** Aceito
**Data:** 2026-09-01

## Contexto
Diferente do fluxo de aprovação de jogo (`review_status`), promoção
de preço é uma ação recorrente — exigir aprovação individual do
admin para cada promoção criaria um gargalo operacional inviável
(mesmo problema identificado pela Steam, que permite publisher criar
sale sem revisão caso a caso).

## Decisão
Studio parceiro pode criar promoção apenas para jogos que ele
possui (verificado via ownership na service layer, mesmo padrão do
fluxo de criação de jogo). Admin pode criar promoção para qualquer
jogo. Nenhuma promoção passa por aprovação manual — o controle é
via ownership, não via revisão de conteúdo.

## Alternativas consideradas
Exigir aprovação de admin por promoção criada por estúdio.
Descartado por criar gargalo operacional sem benefício de segurança
proporcional — diferente de aprovar um jogo (evento único), aprovar
desconto seria recorrente e de baixo risco.

## Consequências
`promotion.id_created_by` registra quem criou (rastreabilidade, sem
ser trava). Fica em aberto, como trabalho futuro, algum limite de
desconto máximo permitido a estúdios sem revisão (ex: cap de 75%),
caso apareça abuso — não implementado agora por falta de necessidade
concreta identificada.

(atualização — 2026-09-02)
Decidido não impor cap de desconto máximo para promoções criadas
por estúdio, mesmo sem revisão de admin. Precedente real observado
(2K com Mafia 1, NetherRealm com Injustice 1 na Steam, ambos
distribuídos gratuitamente como estratégia de relançamento) valida
que 100% de desconto é um caso de uso legítimo, não abuso. O cap
sugerido anteriormente como trabalho futuro fica descartado.

## Implementação de referencia
\`\`\`typescript
// service/promotion.Service.ts
async createPromotion(dto: CreatePromotionDTO, id_user: number, isAdmin: boolean) {
  if (!isAdmin) {
    const isOwner = await this.studioRepository.userOwnsGame(id_user, dto.id_game);
    if (!isOwner) throw new AppError("Você não pode criar promoção para esse jogo", 403, "NOT_GAME_OWNER");
  }
  // segue criação normal
}
\`\`\`
