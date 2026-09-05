# Centralizar mudanças em role_permissions por um único service method

**Status:** Aceito
**Data:** 2026-09-02

## Contexto
Toda alteração em role_permissions precisa vir acompanhada do bump
de permission_version para os usuários daquela role, senão o
mecanismo de invalidação de token fica quebrado silenciosamente.
Escrever esse UPDATE manualmente em cada migration é frágil —
depende de disciplina, não de garantia estrutural.

## Decisão
Toda concessão de permission a uma role precisa passar exclusivamente por
RolePermissionService.grantPermissionToRole(), que sempre executa
o INSERT em role_permissions e o bump de permission_version na
mesma transação. Nenhuma migration ou rota escreve esse UPDATE
manualmente.

## Alternativas consideradas
Trigger no banco (AFTER INSERT/DELETE em role_permissions).
Descartado por consistência com a decisão já tomada de evitar
trigger em price_audit — mesmo risco de indisponibilidade em
hospedagens restritivas se aplicaria aqui.

## Consequências
Garantia é de aplicação, não de banco — uma alteração feita via SQL
cru fora do service (ex: direto no DBeaver) não dispara o bump. Como
essa é uma ação administrativa rara e controlada, o trade-off é
aceitável.

## Implementação de referencia
\`\`\`typescript
// services/rolePermission.Service.ts
export class RolePermissionService {
  constructor(private rolePermissionRepository: RolePermissionRepository, private userRepository: UserRepository) {}

  async grantPermissionToRole(id_role: number, id_permission: number): Promise<void> {
    const connection = await this.pool.getConnection();
    await connection.beginTransaction();
    try {
      await this.rolePermissionRepository.grant(id_role, id_permission, connection);
      await this.userRepository.bumpPermissionVersionForRole(id_role, connection);
      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
}
\`\`\`
