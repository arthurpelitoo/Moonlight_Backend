import type { Pool, PoolConnection, ResultSetHeader } from "mysql2/promise";
import type { Game } from "../@types/game/repository/game.repository.js";
import type { GameCountRows, GameRow } from "../@types/game/repository/game.row.js";
import pool from "../config/database.js";
import type { CreateGameDTO, UpdateGameDTO } from "../@types/game/dto/game.input.dto.js";
import type { FilterParams, QueryOptions } from "../@types/common/pagination.js";

export class GameRepository{

    constructor(private pool: Pool){}

    async findAllPaginated({filters, pagination}: QueryOptions): Promise<Game[]>{
        const [rows] = await pool.query<GameRow[]>(`
                SELECT g.*, GROUP_CONCAT(c.name) AS categories
                FROM game g
                LEFT JOIN game_category gc ON g.id_game = gc.id_game
                LEFT JOIN category c ON gc.id_category = c.id_category
                ${filters.where}
                GROUP BY g.id_game
                ORDER BY ${filters.order}
                LIMIT ? OFFSET ?
            `, [...filters.dbParams, pagination.limit, pagination.offset]);
        return this.mapCategories(rows);
    }

    async findAll(): Promise<Game[]>{
        const [rows] = await pool.query<GameRow[]>(`
            SELECT g.*, GROUP_CONCAT(c.name) AS categories
            FROM game g
            LEFT JOIN game_category gc ON g.id_game = gc.id_game
            LEFT JOIN category c ON gc.id_category = c.id_category
            GROUP BY g.id_game
        `);

        return this.mapCategories(rows);
    }

    async findById(id_game: number): Promise<Game | null>{
        const [row] = await pool.query<GameRow[]>(`
                SELECT g.*, GROUP_CONCAT(c.name) AS categories
                FROM game g
                LEFT JOIN game_category gc ON g.id_game = gc.id_game
                LEFT JOIN category c ON gc.id_category = c.id_category
                WHERE g.id_game = ?
                AND g.active = 1
                GROUP BY g.id_game
            `, [id_game]);

            const game = this.mapCategories(row);
            return game[0] ?? null;
    }

    async create(query: CreateGameDTO, connection?: PoolConnection): Promise<number>{
        const db = connection ?? this.pool;
        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO game (title, description, price, image, banner_image, link, launch_date, active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [query.title, query.description, query.price, query.image, query.banner_image, query.link, query.launch_date, query.active ? 1 : 0]
        )

        const id_game = result.insertId;
        return id_game;
    }

    async update(query: UpdateGameDTO, connection?: PoolConnection): Promise<boolean>{
        const db = connection ?? this.pool;
        const [result] = await db.query<ResultSetHeader>(
            `UPDATE game SET 
            title = ?, description = ?, price = ?, image = ?, 
            banner_image = ?, link = ?, launch_date = ?, active = ?
            WHERE id_game = ?`,
            [query.title, query.description, query.price, query.image, query.banner_image, query.link, query.launch_date, query.active, query.id_game]
        );

        return result.affectedRows > 0;
    }

    async delete(id_game: number): Promise<boolean>{
        const [result] = await pool.query<ResultSetHeader>('DELETE FROM game WHERE id_game = ?', [id_game])

        return result.affectedRows > 0;
    }

    async count({where, dbParams}: FilterParams): Promise<number>{
        const [rows] = await pool.query<GameCountRows[]>(
            `SELECT COUNT(DISTINCT g.id_game) as total 
            FROM game g
            LEFT JOIN game_category gc ON g.id_game = gc.id_game
            LEFT JOIN category c ON gc.id_category = c.id_category
            ${where}`,
            dbParams
        );

        return rows[0]?.total ?? 0;
    }

    private mapCategories(rows: GameRow[]): Game[] {
        return rows.map(game => ({
            ...game,
            categories: game.categories ? game.categories.split(",") : []
        })) as Game[];
    }

    async replaceCategories(id_game: number, categories?: number[], connection?: PoolConnection){
        const db = connection ?? this.pool;
        await db.query('DELETE FROM game_category WHERE id_game = ?', [id_game]);

        if(!categories?.length) return;

        const values = categories.map(id_category => [id_game, id_category]);
        await db.query('INSERT INTO game_category (id_game, id_category) VALUES ?', [values]);
    }

}