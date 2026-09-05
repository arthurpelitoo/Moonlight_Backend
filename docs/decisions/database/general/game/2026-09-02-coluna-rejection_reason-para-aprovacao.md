# Coluna rejection_reason no game, para o fluxo de aprovação

**Status:** Aceito
**Data:** 2026-09-02

## Contexto
O Diagrama de Atividades do fluxo de aprovação de jogo previa que o
estúdio fosse "notificado do motivo" de uma rejeição, mas o schema
não tinha nenhum campo para armazenar esse texto — inconsistência
identificada ao comparar diagrama com schema.

## Decisão
Adicionar `game.rejection_reason VARCHAR(255) NULL`, preenchido pelo
admin ao rejeitar um jogo e limpo automaticamente quando o estúdio
reenvia para revisão.

## Consequências
Fluxo de rejeição passa a ser auditável e comunicável de fato.
Faz parte do schema planejado (v3), não implementado neste semestre.
