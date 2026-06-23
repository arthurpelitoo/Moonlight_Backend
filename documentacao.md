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

## Paginação de Games:

## Parâmetros Disponíveis
 
| Parâmetro         | Tipo     | Descrição                                  |
|-------------------|----------|--------------------------------------------|
| `page`            | number   | Página atual (padrão: 1)                   |
| `limit`           | number   | Itens por página (padrão: 8)               |
| `random`          | boolean  | Ordenação aleatória (padrão: false)        |
| `title`           | string   | Busca parcial por título (LIKE)            |
| `category`        | string   | Nome exato da categoria                    |
| `price_min`       | number   | Preço mínimo (inclusive)                   |
| `price_max`       | number   | Preço máximo (inclusive)                   |
| `launch_date_from`| string   | Data de lançamento inicial (`YYYY-MM-DD`)  |
| `launch_date_to`  | string   | Data de lançamento final (`YYYY-MM-DD`)    |
 
---
 
## Comportamento dos Filtros
 
### Preço
 
| `price_min` | `price_max` | Comportamento                          | SQL gerado                          |
|-------------|-------------|----------------------------------------|-------------------------------------|
| ✅           | ✅           | Range fechado — entre min e max        | `price >= min AND price <= max`     |
| ✅           | ❌           | Aberto para cima — a partir do mínimo  | `price >= min`                      |
| ❌           | ✅           | Aberto para baixo — até o máximo       | `price <= max`                      |
| ❌           | ❌           | Sem filtro — retorna qualquer preço    | *(sem condição)*                    |
 
### Data de Lançamento
 
| `launch_date_from` | `launch_date_to` | Comportamento                             | SQL gerado                                              |
|--------------------|------------------|-------------------------------------------|---------------------------------------------------------|
| ✅                  | ✅                | Range fechado — entre as duas datas       | `DATE(launch_date) >= from AND DATE(launch_date) <= to` |
| ✅                  | ❌                | Da data em diante (sem limite superior)   | `DATE(launch_date) >= from`                             |
| ❌                  | ✅                | Até a data (sem limite inferior)          | `DATE(launch_date) <= to`                               |
| ❌                  | ❌                | Sem filtro — retorna qualquer data        | *(sem condição)*                                        |
 
### Combinação Preço + Data
 
| `price_min` | `price_max` | `launch_date_from` | `launch_date_to` | Comportamento                                  |
|-------------|-------------|---------------------|------------------|------------------------------------------------|
| ✅           | ✅           | ✅                   | ✅                | Jogos no range de preço e no range de data     |
| ✅           | ❌           | ✅                   | ❌                | Acima do preço mínimo e lançados após a data   |
| ❌           | ✅           | ❌                   | ✅                | Abaixo do preço máximo e lançados antes da data|
| ✅           | ✅           | ❌                   | ❌                | Só filtra por preço, ignora data               |
| ❌           | ❌           | ✅                   | ✅                | Só filtra por data, ignora preço               |
| ❌           | ❌           | ❌                   | ❌                | Sem filtro de preço nem de data                |
 
### Combinação com Outros Filtros
 
| `title`    | `category`  | `price_min/max`    | `launch_date_from/to`  | Comportamento                                              |
|------------|-------------|---------------------|------------------------|------------------------------------------------------------|
| ✅          | ❌           | ❌                   | ❌                      | Busca só por título (LIKE)                                 |
| ❌          | ✅           | ❌                   | ❌                      | Busca só por categoria                                     |
| ✅          | ✅           | ❌                   | ❌                      | Título E categoria                                         |
| ✅          | ✅           | ✅ / ✅              | ❌                      | Título, categoria e range de preço                         |
| ❌          | ✅           | ❌                   | ✅ / ✅                  | Categoria e range de data                                  |
| ✅          | ✅           | ✅ / ✅              | ✅ / ✅                  | Todos os filtros combinados                                |
 
---
 
## Exemplos de Requisição
 
```bash
# Todos os jogos (sem filtro)
GET /games
 
# Só paginação
GET /games?page=2&limit=10
 
# Busca por título
GET /games?title=zelda
 
# Busca por categoria
GET /games?category=RPG
 
# Range de preço fechado
GET /games?price_min=20&price_max=100
 
# Jogos gratuitos até baratos
GET /games?price_max=30
 
# Só a partir de um preço
GET /games?price_min=50
 
# Lançamentos de 2024
GET /games?launch_date_from=2024-01-01&launch_date_to=2024-12-31
 
# Lançamentos recentes (sem limite de data final)
GET /games?launch_date_from=2024-06-01
 
# Tudo combinado
GET /games?category=RPG&price_max=59.99&launch_date_from=2023-01-01&page=1&limit=8
```
 
---
 
## Observações Técnicas
 
- Todos os filtros são **opcionais e independentes** — o backend só adiciona a condição SQL se o parâmetro estiver presente na query string.
- `price_min` e `price_max` usam `>=` e `<=` respectivamente, ou seja, os valores informados são **inclusivos**.
- `launch_date_from` e `launch_date_to` aplicam `DATE()` sobre o campo, ignorando a hora.
- `title` usa `LIKE %valor%`, buscando jogos que **contenham** o texto em qualquer posição.
- `category` usa comparação **exata** (`= ?`), não parcial.
- O parâmetro `random=true` substitui a ordenação padrão por `RAND()`.
 
---