// src/controllers/UserController.ts
import { Request, Response } from 'express';
import { createPool } from '../config/database';

const getUsers = async (req: Request, res: Response) => {
  try {
    const [rows] = await createPool.query('SELECT id_usuario, nome_usuario, email_usuario FROM users');
    
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar usuários", error });
  }
};

export default getUsers; 