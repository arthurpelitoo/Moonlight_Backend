## 🌙 Sobre o Projeto
Este é o **🗃️Back-end** do projeto **🌙Moonlight**, uma loja de e-commerce focada no público gamer. A aplicação foi construída utilizando **❇️Node.js** e **📈TypeScript** para garantir maior segurança e organização no desenvolvimento.

📌Esta parte da aplicação é responsável por gerenciar o banco de dados, autenticação de usuários e as regras de negócios da loja.👾

📂 Estrutura de Pastas

src/config/: Configurações de banco de dados.

src/controllers/: Lógica das requisições.

src/routes/: Definição dos caminhos da API.

src/server.ts: Ponto de entrada da aplicação.

src/server.ts: Ponto de entrada da aplicação (onde o servidor "funciona").

src/middlewares/: Filtros de segurança e validações que rodam antes de chegar na rota. 

src/services/: Onde fica a regra de negócio (ex: cálculos, integração com banco).

src/utils/: Validadores e funções auxiliares.

---

## 🛠️ Tecnologias e Dependências 💻
Para que tudo funcione sem erros, estas são as ferramentas que estamos utilizando:

### Core:
* 🚄**Express**: Framework para criação das rotas e do servidor.
* 📈**TypeScript**: Tipagem estática para evitar erros bobos de lógica.
* 🗄️**MySQL2**: Driver para conexão e execução de queries no banco de dados.
* ⚙️**Dotenv**: Gerenciamento de variáveis de ambiente (proteção de senhas).
* 📶**CORS**: Permite que o seu Front-end (React) converse com este Back-end.

### Utilitários e Validação:
* 🪪**cpf-cnpj-validator**: Biblioteca para garantir que os documentos dos clientes sejam reais.
* 📤**Axios**: Para possíveis integrações com APIs externas.

### Desenvolvimento:
* 🔧**ts-node-dev**: Ferramenta que reinicia o servidor automaticamente a cada alteração no código.
