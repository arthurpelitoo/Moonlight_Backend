import type { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/database.js";
import type { ApprovedOrdersOfUser, Order, OrderWithoutUser } from "../@types/order/repository/order.repository.js";
import type { CreateOrderDTO, UpdateOrderDTO } from "../@types/order/dto/order.input.dto.js";
import type { LibraryOrderRows, MyOrderRows, OrderRow } from "../@types/order/repository/order.row.js";

export class OrderRepository{

    async findUserLibrary(id_user: number): Promise<ApprovedOrdersOfUser[] | null> {
        const [rows] = await pool.query<LibraryOrderRows[]>(`
            SELECT g.*,
                GROUP_CONCAT(DISTINCT c.name) AS categories
            FROM purchased_items pi
            INNER JOIN \`order\` o ON o.id_order = pi.id_order
            INNER JOIN game g ON g.id_game = pi.id_game
            LEFT JOIN game_category gc ON gc.id_game = g.id_game
            LEFT JOIN category c ON c.id_category = gc.id_category
            WHERE o.id_user = ? AND o.status = 'approved'
            GROUP BY g.id_game
        `, [id_user]);

        return rows.map(game => ({
            ...game,
            categories: game.categories ? game.categories.split(',') : []
        })) ?? null;
    }

    async findMyOrders(id_user: number): Promise<OrderWithoutUser[] | null>{

        const [rows] = await pool.query<MyOrderRows[]>(`
        SELECT 
            o.id_order, o.order_date, o.total, o.status,
            g.title, g.image,
            pi.price AS price
        FROM \`order\` o
        INNER JOIN user u ON o.id_user = u.id_user
        INNER JOIN purchased_items pi ON o.id_order = pi.id_order
        INNER JOIN game g ON pi.id_game = g.id_game
        WHERE o.id_user = ?
        ORDER BY o.order_date DESC
        `, [id_user]);

        return this.mapMyOrders(rows) ?? null
    }

    async findAll(): Promise<Order[]>{
        const [rows] = await pool.query<OrderRow[]>(`
          SELECT 
            o.id_order, o.order_date, o.total, o.status,
            u.name, u.email,
            g.title, g.image,
            pi.price AS price
          FROM \`order\` o
          INNER JOIN user u ON o.id_user = u.id_user
          INNER JOIN purchased_items pi ON o.id_order = pi.id_order
          INNER JOIN game g ON pi.id_game = g.id_game
          ORDER BY o.order_date DESC
        `);
        return this.mapOrderList(rows);
    }

    async findById(id_order: number): Promise<Order | null>{
        const [rows] = await pool.query<OrderRow[]>(`
          SELECT 
            o.id_order, o.order_date, o.total, o.status,
            u.name, u.email,
            g.title, g.image,
            pi.price AS price
          FROM \`order\` o
          INNER JOIN user u ON o.id_user = u.id_user
          INNER JOIN purchased_items pi ON o.id_order = pi.id_order
          INNER JOIN game g ON pi.id_game = g.id_game
          WHERE o.id_order = ?
        `, [id_order]);

        const order = this.mapOrderList(rows);
        return order[0] ?? null;
    }

    async canPurchaseGame(id_user: number, id_game: number): Promise<boolean> {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT 1 FROM purchased_items pi 
            INNER JOIN \`order\` o ON o.id_order = pi.id_order 
            WHERE o.id_user = ? AND pi.id_game = ? AND o.status = 'approved' 
            LIMIT 1`,
            [id_user, id_game]
        );
        return rows.length === 0; // Retorna true se NÃO encontrar o jogo na "biblioteca" do usuario
    }

    async create(query: CreateOrderDTO): Promise<number>{
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO `order` (id_user, order_date, total, preference_id, external_reference, status) VALUES (?, NOW(), ?, ?, ?, ?)',
            [query.id_user, query.total, query.preference_id, query.external_reference, query.status]
        );
        return result.insertId;
    }

    async updateStatus(query: UpdateOrderDTO): Promise<boolean>{
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE `order` SET status = ? WHERE external_reference = ?',
            [query.status, query.external_reference]
        );

        return result.affectedRows > 0;
    }

    private mapOrderList(rows: OrderRow[]): Order[]{
        const ordersMap = new Map<number, Order>();

        for(const row of rows){
            let order = ordersMap.get(row.id_order);

            if(!order){
                order = {
                    id_order: row.id_order,
                    order_date: row.order_date,
                    total: row.total,
                    status: row.status,
                    user: {
                        name: row.name,
                        email: row.email
                    },
                    games: []
                };

                ordersMap.set(row.id_order, order);
            }

            order.games.push({
                title: row.title,
                image: row.image,
                price: row.price
            });
        }

        return Array.from(ordersMap.values());
    }

    private mapMyOrders(rows: MyOrderRows[]): OrderWithoutUser[] {
        const ordersMap = new Map<number, OrderWithoutUser>();

        for(const row of rows){
            let order = ordersMap.get(row.id_order);

            if(!order){
                order = {
                    id_order: row.id_order,
                    order_date: row.order_date,
                    total: row.total,
                    status: row.status,
                    games: []
                };

                ordersMap.set(row.id_order, order);
            }

            order.games.push({
                title: row.title,
                image: row.image,
                price: row.price
            });
        }

        return Array.from(ordersMap.values());
    }

}