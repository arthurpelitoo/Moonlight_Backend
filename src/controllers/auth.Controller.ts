import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

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

    const user = (rows as any[])[0];

    // Verifica se usuário existe
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Verifica se a senha está correta
    const senhaCorreta = await bcrypt.compare(password_user, user.password_user);
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Gera o token JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'JWT_SECRET não configurado' });
    }

    const token = jwt.sign(
      { id_usuario: user.id_usuario },
      secret,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      token,
      user: {
        id_usuario: user.id_usuario,
        nome_usuario: user.nome_usuario,
        email_user: user.email_user,
        nivel_acesso: user.nivel_acesso
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno ao realizar login', error });
  }
};