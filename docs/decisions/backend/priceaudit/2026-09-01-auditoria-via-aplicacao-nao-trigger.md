# Auditoria de preço via aplicação, não trigger de banco

**Status:** Aceito
**Data:** 2026-09-01

## Contexto
A auditoria de alteração de preço (`price_audit`) era populada por
uma trigger MySQL, usando a variável de sessão `@usuario_logado`
(setada manualmente pelo controller antes do UPDATE) com fallback
para `USER()`. Isso cria dependência de um recurso (trigger) que
pode não estar disponível em hospedagens mais restritivas, e grava
o autor da alteração como VARCHAR solto, sem integridade referencial
com `user`.

## Decisão
Mover a lógica de auditoria para a aplicação (PriceAuditService +
PriceAuditRepository), disparada dentro da mesma transação do
GameService.update, comparando preço antigo vs. novo explicitamente.
A coluna `altered_byUser` (VARCHAR) é substituída por
`altered_by_user` (BIGINT, FK para `user`).

## Alternativas consideradas
Manter a trigger. Descartado por risco de indisponibilidade em
hospedagens restritivas e por gravar autoria como VARCHAR sem
garantia de integridade.

## Consequências
Lógica de auditoria fica visível e testável no código da aplicação,
em vez de escondida no banco. Perde-se a garantia de "toda alteração
de preço é auditada não importa a origem" (um UPDATE feito fora da
aplicação, ex: direto no DBeaver, não passa mais pela auditoria) —
trade-off aceito, já que o sistema não expõe acesso direto ao banco
para usuários finais.

## Implementacao de referência:
---

\`\`\`typescript
// repositories/PriceAuditRepository.ts
export class PriceAuditRepository {
  constructor(private pool: Pool) {}
  async record(entry: { id_game: number; price_old: number; price_new: number; altered_by_user: number | null }, connection?: PoolConnection) {
    const db = connection ?? this.pool;
    await db.query(
      `INSERT INTO price_audit (id_game, price_old, price_new, altered_by_user) VALUES (?, ?, ?, ?)`,
      [entry.id_game, entry.price_old, entry.price_new, entry.altered_by_user]
    );
  }
}
\`\`\`

---

\`\`\`typescript
// services/priceAudit.Service.ts
export class PriceAuditService {
  constructor(private priceAuditRepository: PriceAuditRepository) {}
  async recordIfChanged(id_game: number, priceOld: number, priceNew: number, id_user: number | null, connection?: PoolConnection) {
    if (Number(priceOld) === Number(priceNew)) return;
    await this.priceAuditRepository.record({ id_game, price_old: priceOld, price_new: priceNew, altered_by_user: id_user }, connection);
  }
}
\`\`\`

### GameService.update — precisa buscar o preço antigo antes do UPDATE, dentro da mesma transação:

\`\`\`typescript
async update(dto: UpdateGameDTO, id_user: number | null): Promise<boolean>{
    const connection = await this.pool.getConnection();
    await connection.beginTransaction();
    try{
        validateGame(dto);
        const currentGame = await this.gameRepository.findByIdForUpdate(dto.id_game, connection);
        const updated = await this.gameRepository.update(dto, connection);
        await this.gameRepository.replaceCategories(dto.id_game, dto.categories, connection);
        if (currentGame) {
          await this.priceAuditService.recordIfChanged(dto.id_game, currentGame.price, dto.price, id_user, connection);
        }
        await connection.commit();
        return updated;
    } catch(err){
        await connection.rollback();
        throw err;
    } finally{
        connection.release();
    }
}
\`\`\`
