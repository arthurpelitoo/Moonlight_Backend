import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { isStrongPassword, isValidEmail, validateCPF } from '../utils/validators.js';

export const login = async (req: Request, res: Response) => {
  try {
    const { email_user, password_user } = req.body;

    // Campos obrigatórios
    if (!email_user || !password_user) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    // Busca usuário no banco pelo email
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email_user = ?',
      [email_user]
    );

    const User = (rows as any[])[0];

    // Verifica se usuário existe
    if (!User) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Verifica se a senha está correta
    const passwordCorrect = await bcrypt.compare(password_user, User.password_user);
    if (!passwordCorrect) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Gera o token JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'JWT_SECRET não configurado' });
    }

    const token = jwt.sign(
      { id_user: User.id_user, 
        type: User.type
      },
      secret,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      token,
      User: {
        id_user: User.id_user,
        name_user: User.name_user,
        email_user: User.email_user,
        level_access: User.level_access
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno ao realizar login', error });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
   const { name_user, email_user, password_user, cpf_user } = req.body;

    if (!name_user || !email_user || !password_user || !cpf_user) {
      return res.status(400).json({ message: 'nome_usuario, email_usuario, senha_usuario e cpf_usuario são obrigatórios' });
    }

    if (!validateCPF(cpf_user)) {
      return res.status(400).json({ message: 'CPF inválido' });
    }

  if (!isValidEmail(email_user)) {
      return res.status(400).json({ message: 'Email inválido' });
    }

    if (!isStrongPassword(password_user)) {
      return res.status(400).json({ message: 'Senha deve ter pelo menos 8 caracteres, maiúscula, minúscula, número e caractere especial' });
    }

  const [emailCheck] = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE email_usuario = ?',
      [email_user]
    );

    if ((emailCheck as any)[0].count > 0) {
      return res.status(409).json({ message: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password_user, 12);

    const [result] = await pool.query(
      'INSERT INTO users (nome_usuario, email_usuario, senha_usuario, cpf_usuario, nivel_acesso) VALUES (?, ?, ?, ?, ?)',
      [name_user, email_user, hashedPassword, cpf_user, 'cliente']
    );

    const newUserId = (result as any).insertId;
    return res.status(201).json({ message: 'Usuário criado com sucesso!', id_usuario: newUserId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno ao criar usuário', error });
  }
};