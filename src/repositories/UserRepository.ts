import type { ResultSetHeader } from "mysql2";
import pool from "../config/database.js";
import type { UserCountRows, UserRow, UserRowWithPassword } from "../@types/user/repository/user.row.js";
import type { CreateUserDTO, UpdateMeDTO, UpdateUserDTO } from "../@types/user/dto/user.input.dto.js";
import type { UserWithoutPassword, UserWithPassword } from "../@types/user/repository/user.repository.js";
import type { FilterParams, QueryOptions } from "../@types/common/pagination.js";

export class UserRepository{

    async findAllPaginated({filters, pagination}: QueryOptions): Promise<UserWithoutPassword[]>{
        const [rows] = await pool.query<UserRow[]>(`
            SELECT id_user, name, email, cpf, type FROM user
            ${filters.where}
            ORDER BY id_user
            ASC LIMIT ? OFFSET ?`, 
            [...filters.dbParams, pagination.limit, pagination.offset]);

        return rows;
    }

    async findAll(): Promise<UserWithoutPassword[]>{
        const [rows] = await pool.query<UserRow[]>(`
            SELECT id_user, name, email, cpf, type 
            FROM user
            ORDER BY id_user
            `);
        
        return rows;
    }

    async findById(id_user: number): Promise<UserWithoutPassword | null>{
        const [rows] = await pool.query<UserRow[]>(
        'SELECT id_user, name, email, cpf, type FROM user WHERE id_user = ?',
        [id_user]
        );

        return rows[0] ?? null;
    }

    async findByEmail(email: string): Promise<UserWithPassword | null>{
        const [rows] = await pool.query<UserRowWithPassword[]>(
            'SELECT id_user, name, email, password, type, cpf FROM user WHERE email = ?',
            [email]
        );

        
        return rows[0] ?? null;
    }

    async create(query: CreateUserDTO): Promise<number>{
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO user (name, email, password, cpf, type) VALUES (?, ?, ?, ?, ?)',
            [query.name, query.email, query.password, query.cpf, query.type]
        );
        return result.insertId;
    }
    
    async update(query: UpdateUserDTO): Promise<boolean>{
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE user SET name = ?, email = ?, password = ?, cpf = ?, type = ? WHERE id_user = ?',
            [query.name, query.email, query.password, query.cpf, query.type, query.id_user]
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
      const [rows] = await pool.query<UserCountRows[]>(
        'SELECT 1 FROM user WHERE email = ? LIMIT 1',
        [email]
      );

      return rows.length > 0;
    };

    async emailTakenByAnotherUser(email: string, id_user: number): Promise<boolean>{
        const [rows] = await pool.query<UserCountRows[]>(
        'SELECT 1 FROM user WHERE email = ? AND id_user <> ? LIMIT 1',
        [email, id_user]
        );

      return rows.length > 0;
      //id_user <> ?
      //"mesmo email, mas não eu"
    }

    async count({ where, dbParams }: FilterParams): Promise<number> {
        const [rows] = await pool.query<UserCountRows[]>(
            `SELECT COUNT(*) as total FROM user ${where}`,
            dbParams
        );

        return rows[0]?.total ?? 0;
    }

}