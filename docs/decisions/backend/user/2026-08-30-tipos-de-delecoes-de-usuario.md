# Três fluxos distintos para remoção de usuário: teste, moderação e autoexclusão

**Status:** Aceito
**Data:** 2026-08-30

## Contexto
"Deletar usuário" cobria só um caso até agora: apagar registro de
teste do banco. Mas o sistema vai precisar de mais cenários que
parecem a mesma coisa mas têm donos e motivações diferentes: admin
banindo/suspendendo um usuário real, o próprio usuário optando por
encerrar a conta, e limpeza de dado de teste no ambiente de dev.

## Decisão
Separar em três fluxos, cada um com seu próprio mecanismo:

1. **Registro de teste** — DELETE físico de verdade, feito direto
   no banco ou por um script de seed/reset, fora da API e sem
   permission envolvida (não é ação de produto).
2. **Moderação (admin sobre outro usuário)** — nunca DELETE físico;
   muda `account_status` para `banned`/`suspended`, protegido pela
   permission `user:delete` do RBAC.
3. **Autoexclusão (usuário sobre a própria conta)** — sem permission
   de RBAC (não é ação sobre terceiro, é ownership); muda
   `account_status` para `pending_deletion` com prazo em
   `deletion_scheduled_at`. Ao expirar, os dados pessoais
   (nome, email, cpf) são anonimizados, mas a linha do `user`
   permanece para manter a integridade referencial com `order`,
   `purchased_items` e `price_audit`, e para atender à LGPD sem
   perder rastreabilidade financeira/de auditoria.

## Alternativas consideradas
Modelar banimento como uma role (`banned`) em vez de um valor de
`account_status`. Descartado: o RBAC do projeto é aditivo (uma role
só concede permissões, nunca as retira ou revoga), então uma role "banido"
exigiria uma exceção especial no meio da lógica — o
que indicaria que ela não pertence ao mesmo modelo das demais roles.

## Consequências
Sistema mais realista e alinhado com boas práticas de privacidade
(nunca perde histórico de pedido, mas remove dado pessoal sob
pedido). 

Em troca, três caminhos de código diferentes existem pra
uma ideia que, à primeira vista, parece uma coisa só ("apagar
usuário") — exige atenção pra não misturar os três na hora de
implementar as rotas.
