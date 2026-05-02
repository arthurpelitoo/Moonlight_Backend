import type { ResultSetHeader } from "mysql2";
import pool from "../config/database.js";
import type { PurchasedItemsDTO } from "../@types/purchasedItem/purchasedItem.dto.js";
import { PurchasedItemsRepository } from "../repositories/PurchasedItemsRepository.js";

export class PurchasedItemsService{

    constructor(private purchasedItemsRepository: PurchasedItemsRepository) {}

    async createItems(query: PurchasedItemsDTO): Promise<void> {
        for (const item of query.items) {
            return this.purchasedItemsRepository.createItem({ id_game: item.id_game, id_order: query.id_order, price: item.price });
        }
    }
}