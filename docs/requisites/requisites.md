# Requisitos Funcionais (RF)

| ID | Descrição | Prioridade | Status | Observações / Pendências |
| :--- | :--- | :---: | :---: | :--- |
| **RF01** | Cadastro e login (e-mail/senha) | Alta | ✅ | Implementado |
| **RF02** | Atribuição de cargos (*roles*) pelo Admin | Alta | 🔧 | Previsto para este semestre |
| **RF03** | Navegar/buscar jogos por categoria e/ou estúdio | Alta | 🟡 | Parcial: busca por estúdio depende do RF11 |
| **RF04** | Detalhes do jogo (mídia, descrição, preço, estúdios) | Alta | 🟡 | Mídia e estúdio pendentes de migração |
| **RF05** | Adicionar/remover jogo da *wishlist* | Média | 📅 | Previsto para o próximo semestre |
| **RF06** | Finalizar compra via Mercado Pago | Alta | ✅ | Implementado |
| **RF07** | Histórico de pedidos e biblioteca do usuário | Alta | ✅ | Implementado |
| **RF08** | Avaliar jogo comprado (recomendado/não), editável | Média | 📅 | Previsto para o próximo semestre |
| **RF09** | Solicitar reembolso de um pedido | Média | 📅 | Previsto para o próximo semestre |
| **RF10** | Aprovação/rejeição de reembolso pelo Admin | Média | 📅 | Previsto para o próximo semestre |
| **RF11** | Criação/edição de jogo em rascunho por estúdio parceiro | Baixa | 📅 | Previsto para o próximo semestre |
| **RF12** | Aprovação/rejeição de publicação de jogo pelo Admin | Baixa | 📅 | Previsto para o próximo semestre |
| **RF13** | Gestão de categorias e promoções pelo Admin | Alta | 🟡 | Categorias existentes, promoções proximo semestre |
| **RF14** | Histórico automático de alteração de preço | Média | ✅ | Implementado via *trigger* `price_audit`(migração para lógica na aplicação já decidida, ver ADR, pendente de execução) |
| **RF15** | Registro de tentativas de login (IP, dispositivo) | Baixa | 📅 | Previsto para o próximo semestre |
| **RF16** | Exclusão de conta com prazo de recuperação | Média | 📅 | Coluna criada; *cron* de anonimização pendente |
| **RF17** | Suspensão/banimento de conta de usuário pelo Admin | Média | 📅 | Coluna criada; rota admin pendente, fazer proximo semestre |
| **RF18** | Upload seguro de imagem/mídia para jogos | Alta | 🔧 | Previsto para este semestre |
| **RF19** | Acesso via aplicativo mobile (Expo/React Native) | Alta | 🔧 | Previsto para este semestre |
| **RF20** | Estudio pode associar categorias existentes e deve gerenciar jogos e promoções proprias | Alta | 📅 | Previsto para o próximo semestre |

---

# Requisitos Não Funcionais (RNF)

| ID | Descrição | Categoria | Status | Observações / Detalhes Técnicos |
| :--- | :--- | :--- | :---: | :--- |
| **RNF01** | Armazenamento de senhas com hash seguro (bcrypt) | Segurança | ✅ | Senhas nunca em texto plano |
| **RNF02** | Controle de acesso via RBAC baseado em `resource:action` | Segurança | 📅 | Tabelas migradas; prioridade deste semestre é fazer leitura das roles, no proximo será aplicado o acesso granulado por meio de permissões. |
| **RNF03** | Expiração automática de sessões via token JWT | Segurança | ✅ | Implementado |
| **RNF04** | Ausência de armazenamento de dados sensíveis de pagamento | Segurança / Compliance | ✅ | Processamento delegado inteiramente ao Mercado Pago |
| **RNF05** | Anonimização de dados na exclusão de conta (LGPD) | Compliance | 📅 | Previsto para o próximo semestre |
| **RNF06** | Acessibilidade via Web e Mobile consumindo a mesma API REST | Portabilidade | 🔧 | Arquitetura unificada em desenvolvimento |
| **RNF07** | Versionamento de alterações de *schema* do banco via *migrations* | Manutenibilidade | ✅ | Implementado |
| **RNF08** | Arquitetura em camadas claras (*Controller / Service / Repository*) | Manutenibilidade | ✅ | Implementado |
| **RNF09** | Documentação explicativa de Decisões de Arquitetura (ADR) | Manutenibilidade | ✅ | Registrado no repositório |
| **RNF10** | Paginação obrigatória nas listagens do catálogo | Desempenho | ✅ | Implementado |
