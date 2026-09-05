## Contextualização

Lojas de distribuição digital de jogos (Steam, Epic Games Store, GOG)
resolveram um problema real do mercado: permitir que jogadores comprem,
armazenem e acessem sua biblioteca de jogos de qualquer lugar, sem
mídia física, com descoberta de catálogo, avaliação social (reviews)
e acompanhamento de preços/promoções centralizados. O Moonlight nasce
como uma implementação didática desse modelo, aplicando conceitos de
modelagem de dados, autenticação/autorização e integração de pagamento
num sistema completo, do banco de dados à interface (web e mobile).

## Evolução do produto

O projeto já existia em uma versão anterior em PHP. Ao ser retomado
com uma stack em React (frontend) e Node/Express (backend), a ideia
inicial era seguir um modelo de venda de chaves de jogos de terceiros,
no estilo Nuuvem — decisão descartada por restrição de tempo, já que
o fluxo completo (gestão de estoque de chaves, integração com
fornecedores, entrega pós-compra) não seria viável dentro do prazo
sem comprometer a qualidade da entrega (ver ADR "Pivô: de venda de
chaves para loja estilo Steam Web").

A partir daí, o modelo de negócio foi simplificado para uma loja de
catálogo próprio e curado, inspirada na Steam. O schema inicial (v1)
cobria o núcleo de catálogo e compra: cadastro de jogos, categorias,
usuários, pedidos e integração de pagamento via Mercado Pago.

A versão atual (v2) expande esse núcleo com controle de acesso
baseado em papéis (RBAC), abrangendo desde a distinção entre cliente
e administrador. 

O modelo conceitual completo (refletido no DER) também contempla
funcionalidades de fluxo de aprovação de jogos publicado por estúdios parceiros 
— inspirado, de forma simplificada, no processo de revisão da Steam (Steam Direct/Steamworks), 
contemplando tambem formas de engajamento (reviews, lista de desejos), 
monetização (promoções por jogo) e auditoria (histórico de login, auditoria de alteração de preço),
parte planejada como evolução para o próximo semestre.

## Expansão para mercado internacional 
(remoção da obrigatoriedade de CPF, suporte a múltiplos gateways de pagamento e internacionalização de interface)
identificada como possível evolução de longo prazo, fora do escopo dos próximos dois semestres.
