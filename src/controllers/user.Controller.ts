import type { Request, Response } from 'express';
import pool from '../config/database.js';
import { isValidEmail, isStrongPassword, validateCPF} from '../utils/validators.js';
import bcrypt from 'bcryptjs';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT id_usuario, nome_usuario, email_usuario FROM users');
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar usuários", error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { nome_usuario, senha_usuario, cpf_usuario, nivel_acesso } = req.body;

    if (!nome_usuario || !senha_usuario || !cpf_usuario || !nivel_acesso) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    if (!validateCPF (cpf_usuario)) {
      return res.status(400).json({ message: 'CPF inválido' });
    }

    if (!isStrongPassword(senha_usuario)) {
      return res.status(400).json({ message: 'Senha deve ter pelo menos 16 caracteres, com maiúscula, minúscula, números' });
    }

    const hashedSenha = await bcrypt.hash(senha_usuario, 12);

    const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const userId = req.user!.id_usuario;

    if (parseInt(paramId || '0') !== userId) {
      return res.status(403).json({ message: 'Você só pode editar o seu próprio usuário' });
    }

    const [result] = await pool.query(
      'UPDATE users SET nome_usuario = ?, senha_usuario = ?, cpf_usuario = ?, nivel_acesso = ? WHERE id_usuario = ?',
      [nome_usuario, hashedSenha, cpf_usuario, nivel_acesso, userId]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno ao atualizar usuário', error });
  }
};

//Constante de criação de usuario
export const createUser = async (req: Request, res: Response) => {
  try {
    const { nome_usuario, email_usuario, senha_usuario, cpf_usuario } = req.body;

    if (!nome_usuario || !email_usuario || !senha_usuario || !cpf_usuario) {
      return res.status(400).json({ message: 'nome_usuario, email_usuario, senha_usuario e cpf_usuario são obrigatórios' });
    }

    if (!validateCPF(cpf_usuario)) {
      return res.status(400).json({ message: 'CPF inválido' });
    }

    if (!isValidEmail(email_usuario)) {
      return res.status(400).json({ message: 'Email inválido' });
    }

    if (!isStrongPassword(senha_usuario)) {
      return res.status(400).json({ message: 'Senha deve ter pelo menos 8 caracteres, maiúscula, minúscula, número e caractere especial' });
    }

    const [emailCheck] = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE email_usuario = ?',
      [email_usuario]
    );

    if ((emailCheck as any)[0].count > 0) {
      return res.status(409).json({ message: 'Email já cadastrado' });
    }

    const hashedSenha = await bcrypt.hash(senha_usuario, 12);

    const [result] = await pool.query(
      'INSERT INTO users (nome_usuario, email_usuario, senha_usuario, cpf_usuario, nivel_acesso) VALUES (?, ?, ?, ?, ?)',
      [nome_usuario, email_usuario, hashedSenha, cpf_usuario, 'cliente']
    );

    const newUserId = (result as any).insertId;
    return res.status(201).json({ message: 'Usuário criado com sucesso!', id_usuario: newUserId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno ao criar usuário', error });
  }
};