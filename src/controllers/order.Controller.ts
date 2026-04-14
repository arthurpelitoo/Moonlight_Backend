import type { Request, Response } from 'express';
import pool from '../config/database.js';

//GET ALL, Pega todos os pedidos (admin)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        o.id_order, o.order_date, o.total, o.status,
        u.name AS user_name, u.email AS user_email
      FROM \`order\` o
      INNER JOIN user u ON o.id_user = u.id_user
      ORDER BY o.order_date DESC
    `);

    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar pedidos', error });
  }
};

//Get orders (usuário logado)
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const id_User = req.User!.id_User;

    const [rows] = await pool.query(`
      SELECT 
        o.id_order, o.order_date, o.total, o.status,
        g.title AS game_title, g.image AS game_image,
        pi.price AS item_price, gk.activation_key
      FROM \`order\` o
      INNER JOIN purchased_items pi ON o.id_order = pi.id_order
      INNER JOIN game g ON pi.id_game = g.id_game
      INNER JOIN game_key gk ON pi.id_key = gk.id_key
      WHERE o.id_user = ?
      ORDER BY o.order_date DESC
    `, [id_User]);

    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar seus pedidos', error });
  }
};

//Get pelo Id do pedido
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const id_User = req.User!.id_User;
    const UserType = req.User!.type;

    const [rows] = await pool.query(`
      SELECT 
        o.id_order, o.order_date, o.total, o.status,
        u.name AS user_name, u.email AS user_email,
        g.title AS game_title, g.image AS game_image,
        pi.price AS item_price, gk.activation_key
      FROM \`order\` o
      INNER JOIN user u ON o.id_user = u.id_user
      INNER JOIN purchased_items pi ON o.id_order = pi.id_order
      INNER JOIN game g ON pi.id_game = g.id_game
      INNER JOIN game_key gk ON pi.id_key = gk.id_key
      WHERE o.id_order = ?
    `, [id]);

    const order = (rows as any[])[0];

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

//Usuário comum só pode ver o próprio pedido
    if (UserType !== 'admin' && order.id_User !== id_User) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar pedido', error });
  }
};

//Criar pedido(usuário logado)
export const createOrder = async (req: Request, res: Response) => {
  try {
    const id_User = req.User!.id_User;
    const { games, preference_id, external_reference } = req.body;

    if (!games || !Array.isArray(games) || games.length === 0) {
      return res.status(400).json({ message: 'Informe ao menos um jogo' });
    }

    if (!preference_id || !external_reference) {
      return res.status(400).json({ message: 'preference_id e external_reference são obrigatórios' });
    }

//Calcula total
    let total = 0;
    for (const id_game of games) {
      const [rows] = await pool.query(
        'SELECT price, stock_available FROM game WHERE id_game = ? AND active = 1',
        [id_game]
      );
      const game = (rows as any[])[0];

      if (!game) {
        return res.status(404).json({ message: `Jogo ${id_game} não encontrado` });
      }
      if (game.stock_available <= 0) {
        return res.status(400).json({ message: `Jogo ${id_game} sem estoque` });
      }

      total += parseFloat(game.price);
    }

//Cria o pedido
    const [orderResult] = await pool.query(
      'INSERT INTO `order` (id_user, order_date, total, preference_id, external_reference, status) VALUES (?, NOW(), ?, ?, ?, ?)',
      [id_User, total, preference_id, external_reference, 'pending']
    );

    const id_order = (orderResult as any).insertId;

//Vincula jogos e chaves de pedido
    for (const id_game of games) {
      const [keyRows] = await pool.query(
        'SELECT id_key FROM game_key WHERE id_game = ? AND status = "available" LIMIT 1',
        [id_game]
      );
      const key = (keyRows as any[])[0];

      if (!key) {
        return res.status(400).json({ message: `Sem chave disponível para o jogo ${id_game}` });
      }

      const [priceRows] = await pool.query('SELECT price FROM game WHERE id_game = ?', [id_game]);
      const price = (priceRows as any[])[0].price;

      await pool.query(
        'INSERT INTO purchased_items (id_order, id_game, id_key, price) VALUES (?, ?, ?, ?)',
        [id_order, id_game, key.id_key, price]
      );

//Reserva a chave — trigger atualiza o stock automaticamente
      await pool.query(
        'UPDATE game_key SET status = "reserved" WHERE id_key = ?',
        [key.id_key]
      );
    }

    return res.status(201).json({ message: 'Pedido criado com sucesso!', id_order, total });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao criar pedido', error });
  }
};

//Atualiza o status de pedido (admin) ==========
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ['pending', 'approved', 'canceled'];
    if (!status || !validStatus.includes(status)) {
      return res.status(400).json({ message: 'Status inválido. Use: pending, approved ou canceled' });
    }

    const [result] = await pool.query(
      'UPDATE `order` SET status = ? WHERE id_order = ?',
      [status, id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    return res.status(200).json({ message: 'Status do pedido atualizado com sucesso!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar pedido', error });
  }
};