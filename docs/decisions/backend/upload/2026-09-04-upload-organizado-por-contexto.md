# Upload organizado por contexto (pasta), validado por whitelist

**Status:** Aceito
**Data:** 2026-09-04

## Contexto
O endpoint de upload genérico salvava tudo numa única pasta
`uploads/`, dificultando organização e auditoria por propósito
(imagem de jogo vs. categoria vs. estúdio).

## Decisão
Rota de upload recebe um segmento `:context` (`/api/uploads/:context`),
restrito a uma whitelist fixa no código (`games`, `categories`,
`studios`), que define a subpasta de destino. Validação de tipo de
arquivo/erro do Multer fica isolada em `uploadMiddleware`, não em
controller ou service.

## Alternativas consideradas
Aceitar `context` como string livre do cliente. Descartado por
risco de path traversal — nome de pasta nunca deve vir direto de
input do usuário sem validação contra lista fechada.

## Consequências
Estrutura de uploads fica organizada e auditável
(`uploads/games/`, `uploads/categories/`, ...). Adicionar um novo
contexto exige alterar a whitelist no código (pequena fricção
consciente, em troca de segurança).

## Nota de segurança
`uploads/` é servida publicamente via express.static, sem
autenticação — apropriado apenas para conteúdo já público por
natureza (imagem de catálogo). Qualquer arquivo privado (ex: futuro
comprovante de reembolso, documento de verificação) NUNCA deve ser
salvo nessa pasta; precisa de rota própria com authMiddleware e
checagem de ownership antes de servir o arquivo.
