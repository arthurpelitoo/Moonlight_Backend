import type { Request, Response } from 'express';
import pool from '../config/database.js';
import { isValidEmail, isStrongPassword, validateCPF} from '../utils/validators.js';
import bcrypt from 'bcryptjs';

//Constante de listagem de usuarios
export const getUsers = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT id_usuario, nome_usuario, email_usuario FROM users');
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar usuários", error });
  }
};

//Constante de atualização de usuario
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name_user, password_user, cpf_user, level_access } = req.body;

    if (!name_user || !password_user || !cpf_user || !level_access) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    if (!validateCPF (cpf_user)) {
      return res.status(400).json({ message: 'CPF inválido' });
    }

    if (!isStrongPassword(password_user)) {
      return res.status(400).json({ message: 'Senha deve ter pelo menos 16 caracteres, com maiúscula, minúscula, números' });
    }

    const hashedPassword = await bcrypt.hash(password_user, 12);

    const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const userId = req.user!.id_user;

    if (parseInt(paramId || '0') !== userId) {
      return res.status(403).json({ message: 'Você só pode editar o seu próprio usuário' });
    }

    const [result] = await pool.query(
      'UPDATE users SET nome_usuario = ?, senha_usuario = ?, cpf_usuario = ?, nivel_acesso = ? WHERE id_usuario = ?',
      [name_user, hashedPassword, cpf_user, level_access, userId]
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
    const { name_user, email_user, password_user, cpf_user } = req.body;

    if (!name_user || !email_user || !password_user || !cpf_user) {
      return res.status(400).json({ message: 'nome_usuario, email_usuario, senha_usuario e cpf_usuario são obrigatórios' });
    }

    //validação de cpf
    if (!validateCPF(cpf_user)) {
      return res.status(400).json({ message: 'CPF inválido' });
    }

    //validação de email
    if (!isValidEmail(email_user)) {
      return res.status(400).json({ message: 'Email inválido' });
    }

    //verifiação de nivel de sennha
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

    const hashedPassword= await bcrypt.hash(password_user, 12);

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

export const getUserById = async (req: Request, res: Response) => {
  try {
    const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const [rows] = await pool.query(
      'SELECT id_usuario, nome_usuario, email_usuario, nivel_acesso FROM users WHERE id_usuario = ?',
      [paramId]
    );

    const usuario = (rows as any[])[0];

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno ao buscar usuário', error });
  }
};

// função de delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const userId = req.user!.id_user;

    //proibe usuário de deletar contas secundárias
    if (parseInt(paramId || '0') !== userId) {
      return res.status(403).json({ message: 'Você só pode deletar o seu próprio usuário' });
    }

    const [result] = await pool.query(
      'DELETE FROM users WHERE id_usuario = ?',
      [userId]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.status(200).json({ message: 'Usuário deletado com sucesso!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno ao deletar usuário', error });
  }
};