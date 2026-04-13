// services/UserService.ts
import pool from '../config/database.js';
import type { UserEntity } from '../models/user.js';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { generateHash } from '../utils/hash.js';
import type { PaginatedResponse, RegisterUserQueryPayload, UpdateMeUserQueryPayload, UserDTO, UserPaginatedQueryPayload, UserQueryPayload } from '../@types/index.js';
import { cpfCleaner } from '../utils/validators.js';

export class UserService {
  private static instance: UserService;

  private constructor() {}

  static getInstance(): UserService{
      if(!UserService.instance){
          UserService.instance = new UserService();
      }
      return UserService.instance;
  }

  async findAllPaginated(query: UserPaginatedQueryPayload): Promise<PaginatedResponse<UserDTO>> {
    const offset = (query.page - 1) * query.limit; //itens a pular pra puxar

    const {params, where} = this.buildFilters(query);

    const countParams = [...params];

    params.push(query.limit, offset);

    const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT id_user, name, email, cpf, type 
        FROM user u
        ${where}
        GROUP BY u.id_user
        ORDER BY id_user
        ASC LIMIT ? OFFSET ?`, 
        params
    );

    const [countRows] = await pool.query<RowDataPacket[]>(
        `SELECT COUNT(*) as total FROM user u ${where}`,
        countParams
    );

    return {
        data: rows as UserDTO[],
        total: countRows[0]?.total ?? 0,
        page: query.page,
        totalPages: Math.ceil((countRows[0]?.total ?? 0) / query.limit)
    };
  }

  async findAll(): Promise<UserEntity[] | null>{
      const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT id_user, name, email, cpf, type 
        FROM user u
        GROUP BY u.id_user
        ORDER BY id_user
      `);

      return rows as UserEntity[] ?? null;
  }

  async findById(id_user: number): Promise<UserEntity | null> {
    const [row] = await pool.query<RowDataPacket[]>(
      'SELECT id_user, name, email, cpf, type FROM user WHERE id_user = ?',
      [id_user]
    );
    const user = row as UserEntity[];
    return user[0] ?? null;
  }

  async create(query: UserQueryPayload): Promise<number> {
    const cleanCpf = cpfCleaner(query.cpf);
    const hashedPassword = await generateHash(query.password!);
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO user (name, email, password, cpf, type) VALUES (?, ?, ?, ?, ?)',
      [query.name, query.email, hashedPassword, cleanCpf, query.type]
    );
    return result.insertId;
  }

  async update(query: UserQueryPayload, id_user: number): Promise<boolean> {
    const cleanCpf = cpfCleaner(query.cpf);
    const hashedPassword = await generateHash(query.password!);
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE user SET name = ?, email = ?, password = ?, cpf = ?, type = ? WHERE id_user = ?',
      [query.name, query.email, hashedPassword, cleanCpf, query.type, id_user]
    );
    return result.affectedRows > 0;
  }

  async delete(id_user: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM user WHERE id_user = ?', [id_user]);
    return result.affectedRows >= 0;
  }

  async register(query: RegisterUserQueryPayload): Promise<void>{ // registro que o cliente pode fazer
    const cleanCpf = cpfCleaner(query.cpf);
    const hashedPassword = await generateHash(query.password!);

    await pool.query<ResultSetHeader>(
        'INSERT INTO user (name, email, password, cpf, type) VALUES (?, ?, ?, ?, ?)',
        [query.name, query.email, hashedPassword, cleanCpf, 'customer']
    );  
  }

  async updateMe(query: UpdateMeUserQueryPayload, id_user: number): Promise<boolean> { // edição que o cliente pode fazer
    const cleanCpf = cpfCleaner(query.cpf);
    const hashedPassword = await generateHash(query.password!);
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE user SET name = ?, password = ?, cpf = ? WHERE id_user = ?',
      [query.name, hashedPassword, cleanCpf, id_user]
    );
    return result.affectedRows > 0;
  }

  async emailAlreadyExists(email: string): Promise<boolean>{
      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM user WHERE email = ?',
        [email]
      );

      return (rows[0]?.count ?? 0) > 0;
  }

  private buildFilters(query: UserPaginatedQueryPayload): { where: string; params: unknown[] } {
      let where = 'WHERE 1=1';
      const params = [];

      if (query?.name) {
          where += ' AND u.name LIKE ?';
          params.push(`%${query?.name}%`);
      }
      if (query?.email) {
          where += ' AND u.email LIKE ?';
          params.push(`%${query?.email}%`);
      }
      if(query?.cpf) {
          where += ' AND u.cpf = ?';
          params.push(query?.cpf);
      }
      if(query?.type) {
          where += ' AND u.type = ?';
          params.push(query.type);
      }

      return { where, params };
  }
}