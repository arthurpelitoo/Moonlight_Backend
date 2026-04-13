import type { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/database.js";
import type { GameEntity } from "../models/game.js";
import type { GameDTO, GamePaginatedQueryPayload, GameQueryPayload, PaginatedResponse } from "../@types/index.js";

export class GameService {
  private static instance: GameService;

  private constructor() {}

    static getInstance(): GameService{
        if(!GameService.instance) GameService.instance = new GameService();
        return GameService.instance;
    }

    async findAllPaginated(query: GamePaginatedQueryPayload): Promise<PaginatedResponse<GameDTO>> {
        
        const offset = (query.page - 1) * query.limit; // pra saber quantos itens vão ser pulados
        const order = query.random ? 'RAND()' : 'g.id_game ASC'; // se vai randomizar ou ordenar de forma crescente
        
        const {where, params} = this.buildFilters(query); // constroi os filtros se tiver.

        const countParams = [...params]; // pra nao quebrar o total da segunda query

        params.push(query.limit, offset); // apenas para a primeira query

        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT g.*, GROUP_CONCAT(c.name) AS categories
            FROM game g
            LEFT JOIN game_category gc ON g.id_game = gc.id_game
            LEFT JOIN category c ON gc.id_category = c.id_category
            ${where}
            GROUP BY g.id_game
            ORDER BY ${order}
            LIMIT ? OFFSET ?
        `, params);

        const [countRows] = await pool.query<RowDataPacket[]>(
            `SELECT COUNT(DISTINCT g.id_game) as total 
            FROM game g
            LEFT JOIN game_category gc ON g.id_game = gc.id_game
            LEFT JOIN category c ON gc.id_category = c.id_category
            ${where}`,
            countParams
        );

        return {
            data: this.mapCategories(rows),
            total: countRows[0]?.total ?? 0,
            page: query.page,
            totalPages: Math.ceil((countRows[0]?.total ?? 0) / query.limit)
        };

    }

    async findAll(): Promise<GameEntity[] | null>{
        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT 
            g.id_game, g.title, g.description, g.price,
            g.image, g.link, g.launch_date, g.active,
            GROUP_CONCAT(c.name) AS categories
            FROM game g
            LEFT JOIN game_category gc ON g.id_game = gc.id_game
            LEFT JOIN category c ON gc.id_category = c.id_category
            GROUP BY g.id_game
        `);

        return this.mapCategories(rows) as GameEntity[] ?? null;
    }

    async findById(id_category: number): Promise<GameEntity | null> {

        const [row] = await pool.query<RowDataPacket[]>(`
            SELECT g.*, GROUP_CONCAT(c.name) AS categories
            FROM game g
            LEFT JOIN game_category gc ON g.id_game = gc.id_game
            LEFT JOIN category c ON gc.id_category = c.id_category
            WHERE g.id_game = ?
            AND g.active = 1
            GROUP BY g.id_game
        `, [id_category]);

        const game = this.mapCategories(row) as GameEntity[];
        return game[0] ?? null;
    }

    async create(query: GameQueryPayload): Promise<number>{

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO game (title, description, price, image, banner_image, link, launch_date, active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [query.title, query.description, query.price, query.image, query.banner_image, query.link, query.launch_date, query.active ? 1 : 0]
        );

        const newGameId = result.insertId;

        // Vincula categorias se enviadas
        if (query.categories && Array.isArray(query.categories) && query.categories.length > 0) {
            const categoryValues = query.categories.map((id_category: number) => [newGameId, id_category]);
            await pool.query('INSERT INTO game_category (id_game, id_category) VALUES ?', [categoryValues]);
        }

        return newGameId;
    }

    async update(query: GameQueryPayload, id_game: number): Promise<boolean>{
        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE game SET title = ?, description = ?, price = ?, image = ?, banner_image = ?, link = ?,
            launch_date = ?, active = ? WHERE id_game = ?`,
            [query.title, query.description, query.price, query.image, query.banner_image, query.link, query.launch_date, query.active, id_game]
        );

        // Atualiza categorias se enviadas
        if (query.categories && Array.isArray(query.categories)) {

            await pool.query<ResultSetHeader>('DELETE FROM game_category WHERE id_game = ?', [id_game]);

            if (query.categories.length > 0) {
                const categoryValues = query.categories.map((id_category: number) => [id_game, id_category]);
                await pool.query<ResultSetHeader>('INSERT INTO game_category (id_game, id_category) VALUES ?', [categoryValues]);
            }
        }

        return result.affectedRows > 0;
    }

    async delete(id_game: number): Promise<boolean>{
        const [result] = await pool.query<ResultSetHeader>('DELETE FROM game WHERE id_game = ?', [id_game])

        return result.affectedRows > 0;
    }

    private mapCategories(rows: RowDataPacket[]): GameDTO[] {
        return rows.map(game => ({
            ...game,
            categories: game.categories ? game.categories.split(",") : []
        })) as GameDTO[];
    }

    private buildFilters(query: GamePaginatedQueryPayload): { where: string; params: unknown[] } {
        
        let where;
        const params = [];

        if(query.admin){
            where = 'WHERE 1=1'
        } else{
            where = 'WHERE g.active = 1'
        }

        if (query.active !== undefined) {
            where += ' AND g.active = ?';
            params.push(query.active ? 1 : 0);
        }
        if (query.title) {
            where += ' AND g.title LIKE ?';
            params.push(`%${query.title}%`);
        }
        if (query.category) {
            where += ' AND c.name = ?';
            params.push(query.category);
        }
        if (query.price_min !== undefined) {
            where += ' AND g.price >= ?'; // preço maior 
            params.push(query.price_min);
        }
        if (query.price_max !== undefined) {
            where += ' AND g.price <= ?'; // preço menor
            params.push(query.price_max);
        }
        if (query.launch_date_from) { 
            where += ' AND DATE(g.launch_date) >= ?'; // data de lançamento de jogo que lançou depois ou igual que a Data de lançamento menor
            params.push(query.launch_date_from);
        }
        if (query.launch_date_to) {
            where += ' AND DATE(g.launch_date) <= ?'; // data de lançamento de jogo que lançou antes ou igual que a Data de lançamento maior
            params.push(query.launch_date_to);
        }

        return { where, params };
    }

}