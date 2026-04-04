import type { Request, Response } from 'express';
import pool from '../config/database.js';

// ========== GET ALL GAMES ==========
export const getGames = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        g.id_game, g.title, g.description, g.price,
        g.image, g.link, g.launch_date, g.active, g.stock_available,
        GROUP_CONCAT(c.name) AS categories
      FROM game g
      LEFT JOIN game_category gc ON g.id_game = gc.id_game
      LEFT JOIN category c ON gc.id_category = c.id_category
      WHERE g.active = 1
      GROUP BY g.id_game
    `);

    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar jogos', error });
  }
};

// ========== GET GAME BY ID ==========
export const getGameById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(`
      SELECT 
        g.id_game, g.title, g.description, g.price,
        g.image, g.link, g.launch_date, g.active, g.stock_available,
        GROUP_CONCAT(c.name) AS categories
      FROM game g
      LEFT JOIN game_category gc ON g.id_game = gc.id_game
      LEFT JOIN category c ON gc.id_category = c.id_category
      WHERE g.id_game = ?
      GROUP BY g.id_game
    `, [id]);

    const game = (rows as any[])[0];

    if (!game) {
      return res.status(404).json({ message: 'Jogo não encontrado' });
    }

    return res.status(200).json(game);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar jogo', error });
  }
};

// ========== CREATE GAME (admin) ==========
export const createGame = async (req: Request, res: Response) => {
  try {
    const { title, description, price, image, link, launch_date, active, stock_available, categories } = req.body;

    if (!title || !price || !launch_date || active === undefined || stock_available === undefined) {
      return res.status(400).json({ message: 'title, price, launch_date, active e stock_available são obrigatórios' });
    }

    const [result] = await pool.query(
      `INSERT INTO game (title, description, price, image, link, launch_date, active, stock_available)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, price, image, link, launch_date, active, stock_available]
    );

    const newGameId = (result as any).insertId;

    // Vincula categorias se enviadas
    if (categories && Array.isArray(categories) && categories.length > 0) {
      const categoryValues = categories.map((id_category: number) => [newGameId, id_category]);
      await pool.query('INSERT INTO game_category (id_game, id_category) VALUES ?', [categoryValues]);
    }

    return res.status(201).json({ message: 'Jogo criado com sucesso!', id_game: newGameId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao criar jogo', error });
  }
};

// ========== UPDATE GAME (admin) ==========
export const updateGame = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, price, image, link, launch_date, active, stock_available, categories } = req.body;

    if (!title || !price || !launch_date || active === undefined || stock_available === undefined) {
      return res.status(400).json({ message: 'title, price, launch_date, active e stock_available são obrigatórios' });
    }

    // Trigger de auditoria de preço dispara automaticamente no banco
    await pool.query('SET @usuario_logado = ?', [req.user?.id_user]);

    const [result] = await pool.query(
      `UPDATE game SET title = ?, description = ?, price = ?, image = ?, link = ?,
       launch_date = ?, active = ?, stock_available = ? WHERE id_game = ?`,
      [title, description, price, image, link, launch_date, active, stock_available, id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Jogo não encontrado' });
    }

    // Atualiza categorias se enviadas
    if (categories && Array.isArray(categories)) {
      await pool.query('DELETE FROM game_category WHERE id_game = ?', [id]);
      if (categories.length > 0) {
        const categoryValues = categories.map((id_category: number) => [id, id_category]);
        await pool.query('INSERT INTO game_category (id_game, id_category) VALUES ?', [categoryValues]);
      }
    }

    return res.status(200).json({ message: 'Jogo atualizado com sucesso!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar jogo', error });
  }
};

// ========== DELETE GAME (admin) ==========
export const deleteGame = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM game WHERE id_game = ?', [id]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Jogo não encontrado' });
    }

    return res.status(200).json({ message: 'Jogo deletado com sucesso!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao deletar jogo', error });
  }
};