import type { Role } from "../@types/role/repository/role.repository.js";
import type { RoleRow } from "../@types/role/repository/role.row.js";
import pool from "../config/database.js";


export class RoleRepository {

  async findAll(): Promise<Role[]>{
    const [rows] = await pool.query<RoleRow[]>(`
        SELECT id_role, name
        FROM role
        ORDER BY id_role
        `);

    return rows;
  }

}
