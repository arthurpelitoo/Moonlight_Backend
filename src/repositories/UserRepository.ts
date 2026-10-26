import type { Pool, PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import pool from "../config/database.js";
import type { UserCountRows, UserRoleVersionRow, UserRow, UserRowWithPassword } from "../@types/user/repository/user.row.js";
import type { CreateUserDTO, UpdateMeDTO, UpdateUserDTO } from "../@types/user/dto/user.input.dto.js";
import type { UserWithoutPassword, UserWithPassword } from "../@types/user/repository/user.repository.js";
import type { FilterParams, QueryOptions } from "../@types/common/pagination.js";
import type { RegisterAuthDTO } from "../@types/auth/auth.dto.js";

export class UserRepository{

    async findAllPaginated({filters, pagination}: QueryOptions): Promise<UserWithoutPassword[]>{
        const [rows] = await pool.query<UserRow[]>(`
            SELECT u.id_user, u.name, u.email, u.cpf, GROUP_CONCAT(r.name) AS roles
            FROM user u
            LEFT JOIN user_roles ur ON u.id_user = ur.id_user
            LEFT JOIN role r ON ur.id_role = r.id_role
            ${filters.where}
            GROUP by u.id_user
            ORDER BY u.id_user
            LIMIT ? OFFSET ?`,
            [...filters.dbParams, pagination.limit, pagination.offset]);

      // return rows;
      return this.mapRoles(rows);
    }

    async findAll(): Promise<UserWithoutPassword[]>{
        const [rows] = await pool.query<UserRow[]>(`
            SELECT u.id_user, u.name, u.email, u.cpf, GROUP_CONCAT(r.name) AS roles
            FROM user u
            LEFT JOIN user_roles ur ON u.id_user = ur.id_user
            LEFT JOIN role r ON ur.id_role = r.id_role
            GROUP BY u.id_user
            `);

        return this.mapRoles(rows);
    }

    async findById(id_user: number): Promise<UserWithoutPassword | null>{
        const [row] = await pool.query<UserRow[]>(
        `SELECT u.id_user, u.name, u.email, u.cpf, GROUP_CONCAT(r.name) AS roles
        FROM user u
        LEFT JOIN user_roles ur ON u.id_user = ur.id_user
        LEFT JOIN role r ON ur.id_role = r.id_role
        WHERE u.id_user = ?
        GROUP BY u.id_user
        `, [id_user]);

        const user = this.mapRoles(row);
        return user[0] ?? null;
    }

    async findByEmail(email: string): Promise<UserWithPassword | null>{
        const [rows] = await pool.query<UserRowWithPassword[]>(
            'SELECT id_user, name, email, password, cpf, role_version FROM user WHERE email = ?',
            [email]
        );

        return rows[0] ?? null;
    }

    async create(query: CreateUserDTO | RegisterAuthDTO, connection?: PoolConnection): Promise<number>{
        const db = connection ?? pool;
        const [result] = await db.query<ResultSetHeader>(
            'INSERT INTO user (name, email, password, cpf) VALUES (?, ?, ?, ?)',
            [query.name, query.email, query.password, query.cpf]
        );
        return result.insertId;
    }

  async update(query: UpdateUserDTO, connection?: PoolConnection): Promise<boolean>{
    const db = connection ?? pool;
        const [result] = await db.query<ResultSetHeader>(
            'UPDATE user SET name = ?, email = ?, password = ?, cpf = ? WHERE id_user = ?',
            [query.name, query.email, query.password, query.cpf, query.id_user]
        );
        return result.affectedRows > 0;
    }

    async delete(id_user: number): Promise<boolean>{
        const [result] = await pool.query<ResultSetHeader>(
            'DELETE FROM user WHERE id_user = ?',
            [id_user]
        );

        return result.affectedRows > 0;
    }

    async updateMe(query: UpdateMeDTO): Promise<boolean>{
        const [result] = await pool.query<ResultSetHeader>(
        'UPDATE user SET name = ?, password = ?, cpf = ? WHERE id_user = ?',
        [query.name, query.password, query.cpf, query.id_user]
      );
      return result.affectedRows > 0;
    }

    async emailAlreadyExists(email: string): Promise<boolean>{
      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT 1 FROM user WHERE email = ? LIMIT 1',
        [email]
      );

      return rows.length > 0;
    };

    async emailTakenByAnotherUser(email: string, id_user: number): Promise<boolean>{
        const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT 1 FROM user WHERE email = ? AND id_user <> ? LIMIT 1',
        [email, id_user]
        );

      return rows.length > 0;
      //id_user <> ?
      //"mesmo email, mas não eu"
    }

    private mapRoles(rows: UserRow[]): UserWithoutPassword[] {
        return rows.map(user => ({
            ...user,
            roles: user.roles ? user.roles.split(",") : []
        })) as UserWithoutPassword[];
    }

    async count({ where, dbParams }: FilterParams): Promise<number> {
        const [rows] = await pool.query<UserCountRows[]>(
          `SELECT COUNT(DISTINCT u.id_user) as total
          FROM user u
          LEFT JOIN user_roles ur ON u.id_user = ur.id_user
          LEFT JOIN role r ON ur.id_role = r.id_role
          ${where}`,
          dbParams
        );
        return rows[0]?.total ?? 0;
    }

    async getRoleVersion(id_user: number): Promise<number> {
      const [rows] = await pool.query<UserRoleVersionRow[]>(
        `SELECT role_version FROM user u WHERE id_user = ? LIMIT 1`,
        [id_user]
      );

      return rows[0]?.role_version ?? 1;
    }

    async incrementRoleVersion(id_user: number, connection?: PoolConnection): Promise<void> {
      const db = connection ?? pool;
      await db.query('UPDATE user SET role_version = role_version + 1 WHERE id_user = ?',
        [id_user]
      );
    }

}
