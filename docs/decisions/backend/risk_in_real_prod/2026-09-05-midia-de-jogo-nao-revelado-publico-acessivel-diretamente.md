# Mídia de jogo não revelado fica publicamente acessível via URL direta (risco aceito)

**Status:** Aceito
**Data:** 2026-09-04

## Contexto
Mídia enviada via upload (screenshots, capa) fica em uma URL pública
e estável assim que salva, independente do review_status ou active
do jogo. Um estúdio subindo assets de um jogo ainda não anunciado
gera uma URL acessível por qualquer um que a obtenha (print de tela,
inspeção de rede durante preview), mesmo sem o jogo estar aprovado
ou visível no catálogo.

## Decisão
Aceitar esse risco para o escopo do projeto. A mitigação correta de
mercado (URL assinada com expiração, como AWS S3/Cloudflare signed
URLs) exigiria trocar o serving estático por uma rota autenticada
com geração de token temporário — complexidade desproporcional ao
risco real (vazamento de screenshot de jogo indie, sem impacto
financeiro ou de usuário real).

## Alternativas consideradas
URL assinada com expiração. Descartada por custo de implementação
alto frente ao benefício, dado o contexto acadêmico do projeto.

## Consequências
Fica registrado como limitação conhecida e conscientemente aceita,
não como descuido. Caso o projeto evolua para produção real com
estúdios de verdade protegendo embargo de lançamento, essa decisão
deveria ser revisitada.
