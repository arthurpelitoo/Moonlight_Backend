import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { isStrongPassword, isValidEmail, validateCPF } from '../utils/validators.js';

// ========== LOGIN ==========
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

// Campos obrigatórios
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

 // Busca usuário no banco pelo email
    const [rows] = await pool.query(
      'SELECT * FROM user WHERE email = ?',
      [email]
    );

    const user = (rows as any[])[0];

// Verifica se usuário existe
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

// Verifica se a senha está correta
    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

 // Gera o token JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'JWT_SECRET não configurado' });
    }

    const token = jwt.sign(
      { id_user: user.id_user, type: user.type },
      secret,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      token,
      user: {
        id_user: user.id_user,
        name: user.name,
        email: user.email,
        type: user.type
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno ao realizar login', error });
  }
};

// ========== REGISTER ==========
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, cpf } = req.body;

    if (!name || !email || !password || !cpf) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    if (!validateCPF(cpf)) {
      return res.status(400).json({ message: 'CPF inválido' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email inválido' });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: 'Senha deve ter 8 a 16 caracteres, maiúscula, minúscula e número' });
    }

// Verifica email duplicado
    const [emailCheck] = await pool.query(
      'SELECT COUNT(*) as count FROM user WHERE email = ?',
      [email]
    );
    if ((emailCheck as any)[0].count > 0) {
      return res.status(409).json({ message: 'Email já cadastrado' });
    }

// Verifica CPF duplicado
    const [cpfCheck] = await pool.query(
      'SELECT COUNT(*) as count FROM user WHERE cpf = ?',
      [cpf]
    );
    if ((cpfCheck as any)[0].count > 0) {
      return res.status(409).json({ message: 'CPF já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await pool.query(
      'INSERT INTO user (name, email, password, cpf, type) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, cpf, 'customer']
    );

    const newUserId = (result as any).insertId;

// Gera token automaticamente após cadastro
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'JWT_SECRET não configurado' });
    }

    const token = jwt.sign(
      { id_user: newUserId, type: 'customer' },
      secret,
      { expiresIn: '8h' }
    );

    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso!',
      token,
      user: {
        id_user: newUserId,
        name,
        email,
        type: 'customer'
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno ao cadastrar usuário', error });
  }
};