import type { ResultSetHeader } from "mysql2";
import type { CartItem, PurchasedItemsQueryPayload } from "../@types/index.js";
import pool from "../config/database.js";

export class PurchasedItemsService{
    private static instance: PurchasedItemsService;

    private constructor() {}

    static getInstance(): PurchasedItemsService {
        if (!PurchasedItemsService.instance) PurchasedItemsService.instance = new PurchasedItemsService();
        return PurchasedItemsService.instance;
    }

    async createItems(query: PurchasedItemsQueryPayload): Promise<void> {
        for (const item of query.items) {
            await pool.query<ResultSetHeader>(
                `INSERT INTO purchased_items (id_order, id_game, price) VALUES (?, ?, ?)`,
                [query.id_order, item.id_game, Number(item.price)]
            );
        }
    }
}