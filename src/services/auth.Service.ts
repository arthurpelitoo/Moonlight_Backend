import bcrypt from "bcryptjs";
import pool from "../config/database.js";
import type { UserEntity } from "../models/user.js";
import jwt from 'jsonwebtoken';
import type { RowDataPacket } from "mysql2";

export class AuthService{
    private static instance: AuthService;

    private constructor() {
    }

    static getInstance(): AuthService{
        if(!AuthService.instance){
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async findByEmail(email: string): Promise<UserEntity | null>{
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id_user, name, email, password, type, cpf FROM user WHERE email = ?',
            [email]
        );

        const users = rows as UserEntity[];
        return users[0] ?? null;
    }

    async verifyPassword(password: string, userPassword: string): Promise<boolean>{
        return await bcrypt.compare(password, userPassword);
    }

    generateToken(secret: string | undefined, user: UserEntity): string{
        return jwt.sign(
            { id_user: user.id_user, type: user.type },
            secret!,
            { expiresIn: '8h' }
        );
    }

}