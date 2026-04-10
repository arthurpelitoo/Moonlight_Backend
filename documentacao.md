├── models/       <= classes que representam as entidades.
├── services/      <= classes com a lógica de negócio.
├── controllers/   <= só recebe req/res e chama o service.
├── routes/        <= rotas organizadas e funções que vão chamar.
├── servers/       <= servidor principal.
├── utils/         <= funções simples para auxiliar e reaproveitar codigo.
├── config/        <= configuração geral de conexão.
├── middlewares/   <= autenticadores de rota.
├── @types/        <= tipos globais.

DTO (Data Transfer Object) = formato dos dados que transitam entre front/back e entre camadas.
Entity = classe com estrutura para o service manipular.