// services/UserService.ts
import pool from '../config/database.js';
import type { UserEntity } from '../models/user.js';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { generateHash } from '../utils/hash.js';
import type { RegisterUserData } from '../@types/index.js';
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

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: UserEntity[], total: number }> {
    const offset = (page - 1) * limit; //itens a pular pra puxar

    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT id_user, name, email, cpf, type FROM user ORDER BY id_user ASC LIMIT ? OFFSET ?',
        [limit, offset]
    );

    const [countRows] = await pool.query<RowDataPacket[]>(
        'SELECT COUNT(*) as total FROM user'
    );

    return {
        data: rows as UserEntity[],
        total: countRows[0]?.total ?? 0
    };
  }

  async findById(id_user: number): Promise<UserEntity | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id_user, name, email, cpf, type FROM user WHERE id_user = ?',
      [id_user]
    );
    const users = rows as UserEntity[];
    return users[0] ?? null;
  }

  async create(data: Omit<UserEntity, 'id_user'>): Promise<number> {
    const cleanCpf = cpfCleaner(data.cpf);
    const hashedPassword = await generateHash(data.password!);
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO user (name, email, password, cpf, type) VALUES (?, ?, ?, ?, ?)',
      [data.name, data.email, hashedPassword, cleanCpf, data.type]
    );
    return result.insertId;
  }

  async register(data: RegisterUserData): Promise<void>{
    const cleanCpf = cpfCleaner(data.cpf);
    const hashedPassword = await generateHash(data.password!);

    await pool.query<ResultSetHeader>(
        'INSERT INTO user (name, email, password, cpf, type) VALUES (?, ?, ?, ?, ?)',
        [data.name, data.email, hashedPassword, cleanCpf, 'customer']
    );  
  }

  async update(data: UserEntity): Promise<boolean> {
    const hashedPassword = await generateHash(data.password!);
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE user SET name = ?, email = ?, password = ?, cpf = ?, type = ? WHERE id_user = ?',
      [data.name, data.email, hashedPassword, data.cpf, data.type, data.id_user]
    );
    return result.affectedRows > 0;
  }

  async updateMe(data: Pick<UserEntity, 'name' | 'password' | 'cpf' | 'id_user'>): Promise<boolean> {
    const hashedPassword = await generateHash(data.password!);
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE user SET name = ?, password = ?, cpf = ? WHERE id_user = ?',
      [data.name, hashedPassword, data.cpf, data.id_user]
    );
    return result.affectedRows > 0;
  }

  async delete(id_user: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM user WHERE id_user = ?', [id_user]);
    return result.affectedRows >= 0;
  }

  async emailAlreadyExists(email: string): Promise<boolean>{
      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM user WHERE email = ?',
        [email]
      );

      return (rows[0]?.count ?? 0) > 0;
  }
}