import type { ResultSetHeader } from "mysql2";
import pool from "../config/database.js";
import type { CreatePurchasedItemsDTO } from "../@types/purchasedItem/purchasedItem.dto.js";

export class PurchasedItemsRepository{

    async createItem(query: CreatePurchasedItemsDTO): Promise<void> {
        await pool.query<ResultSetHeader>(
            `INSERT INTO purchased_items (id_order, id_game, price) VALUES (?, ?, ?)`,
            [query.id_order, query.id_game, Number(query.price)]
        );
    }

}