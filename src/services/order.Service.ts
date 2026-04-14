import type { ResultSetHeader } from "mysql2";
import type { OrderQueryPayload } from "../@types/index.js";
import pool from "../config/database.js";

export class OrderService{
    private static instance: OrderService;

    private constructor() {}

    static getInstance(): OrderService {
        if (!OrderService.instance) OrderService.instance = new OrderService();
        return OrderService.instance;
    }

    async createOrder(query: OrderQueryPayload): Promise<number> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO `order` (id_user, order_date, total, preference_id, external_reference, status) VALUES (?, NOW(), ?, ?, ?, ?)',
            [query.id_user, query.total, query.preference_id, query.external_reference, query.status]
        );
        return result.insertId;
    }

    async updateOrder(query: Omit<OrderQueryPayload, "preference_id" | "total" >) {
        const [result] = await pool.query<ResultSetHeader>(
                'UPDATE `order` SET status = ? WHERE external_reference = ?',
                [query.status, query.external_reference]
        );

        return result.affectedRows > 0;
    }
}