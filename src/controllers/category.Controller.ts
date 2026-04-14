import type { Request, Response } from 'express';
import pool from '../config/database.js';

//Get ALL, pega todas as categorias
export const getCategories = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM category');
    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar categorias', error });
  }
};

//faz GET por ID da categoria
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      'SELECT * FROM category WHERE id_category = ?',
      [id]
    );

    const category = (rows as any[])[0];

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar categoria', error });
  }
};

//Criar categoria (admin)
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, image } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'Nome e descrição são obrigatórios' });
    }

    const [result] = await pool.query(
      'INSERT INTO category (name, description, image) VALUES (?, ?, ?)',
      [name, description, image || null]
    );

    const newCategoryId = (result as any).insertId;
    return res.status(201).json({ message: 'Categoria criada com sucesso!', id_category: newCategoryId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao criar categoria', error });
  }
};

//Atualiza categoria (admin)
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, image } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'Nome e descrição são obrigatórios' });
    }

    const [result] = await pool.query(
      'UPDATE category SET name = ?, description = ?, image = ? WHERE id_category = ?',
      [name, description, image || null, id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    return res.status(200).json({ message: 'Categoria atualizada com sucesso!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar categoria', error });
  }
};

//Deleta categoria (admin)
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM category WHERE id_category = ?',
      [id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    return res.status(200).json({ message: 'Categoria deletada com sucesso!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao deletar categoria', error });
  }
};