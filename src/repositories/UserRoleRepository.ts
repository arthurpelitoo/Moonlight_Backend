import type { PoolConnection, RowDataPacket } from "mysql2/promise";
import type { UserRoleRowsName } from "../@types/userRole/repository/userRole.row.js";
import pool from "../config/database.js";
import { AppError } from "../utils/AppError.js";

export class UserRoleRepository {

  async findUserRoleNamesByUser(id_user: number): Promise<string[]> {
    const [rows] = await pool.query<UserRoleRowsName[]>(`
      SELECT r.name FROM user_roles ur
      JOIN role r ON r.id_role = ur.id_role
      WHERE ur.id_user = ?
    `, [id_user]);
    return rows.map(role => role.name);
  }

  async associateUserWithRoleById(id_user: number, roleName: string = 'customer', connection?: PoolConnection): Promise<void>{
    const db = connection ?? pool;
    const [rows] = await db.query<RowDataPacket[]>(`SELECT id_role FROM role r WHERE r.name = ?`, [roleName]);

    const id_role = rows[0]?.id_role;
    if (!id_role) throw new AppError('Role padrão "customer" não encontrada — verifique o seed', 500, 'DEFAULT_ROLE_MISSING');

    const values = [[id_user, id_role]];
    await db.query('INSERT INTO user_roles (id_user, id_role) VALUES ?', [values])
  }

  async findRoleIdsByUser(id_user: number, connection?: PoolConnection): Promise<number[]> {
    const db = connection ?? pool;
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT id_role FROM user_roles WHERE id_user = ?',
      [id_user]
    );
    return rows.map(r => r.id_role);
  }

  async replaceAll(id_user: number, id_roles: number[], connection?: PoolConnection): Promise<void>{
    const db = connection ?? pool;
    await db.query('DELETE FROM user_roles WHERE id_user = ?', [id_user]);
    if (!id_roles.length) return;
    const values = id_roles.map(id_role => [id_user, id_role]);
    await db.query('INSERT INTO user_roles (id_user, id_role) VALUES ?', [values])
  }
}
