import type { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/database.js";
import type { CategoryEntity } from "../models/category.js";
import type { CategoryDTO, CategoryPaginatedQueryPayload, CategoryQueryPayload, PaginatedResponse } from "../@types/index.js";

export class CategoryService {
  private static instance: CategoryService;

  private constructor() {}

    static getInstance(): CategoryService{
        if(!CategoryService.instance) CategoryService.instance = new CategoryService();
        return CategoryService.instance;
    }

    async findAllPaginated(query: CategoryPaginatedQueryPayload): Promise<PaginatedResponse<CategoryDTO>> {
        
        const offset = (query.page - 1) * query.limit; // pra saber quantos itens vão ser pulados
        const order = query.random ? 'RAND()' : 'c.id_category ASC'; // se vai randomizar ou ordenar de forma crescente
        
        const {where, params} = this.buildFilters(query); // constroi os filtros se tiver.

        const countParams = [...params]; // pra nao quebrar o total da segunda query

        params.push(query.limit, offset); // apenas para a primeira query

        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT c.*
            FROM category c
            ${where}
            GROUP BY c.id_category
            ORDER BY ${order}
            LIMIT ? OFFSET ?
        `, params);

        const [countRows] = await pool.query<RowDataPacket[]>(
            `SELECT COUNT(DISTINCT c.id_category) as total 
            FROM category c
            ${where}`,
            countParams
        );

        return {
            data: rows as CategoryDTO[],
            total: countRows[0]?.total ?? 0,
            page: query.page,
            totalPages: Math.ceil((countRows[0]?.total ?? 0) / query.limit)
        };

    }

    async findAll(): Promise<CategoryEntity[] | null>{
        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT 
            c.*
            FROM category c
            GROUP BY c.id_category
        `);

        return rows as CategoryEntity[] ?? null;
    }

    async findById(id_category: number): Promise<CategoryEntity | null> {

        const [row] = await pool.query<RowDataPacket[]>(`
            SELECT c.*
            FROM category c
            WHERE c.id_category = ?
            GROUP BY c.id_category
        `, [id_category]);

        const category = row as CategoryEntity[];
        return category[0] ?? null;
    }

    async create(query: CategoryQueryPayload): Promise<number>{

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO category (name, description, image)
            VALUES (?, ?, ?)`,
            [query.name, query.description, query.image]
        );

        const newCategoryId = result.insertId;
        return newCategoryId;
    }

    async update(query: CategoryQueryPayload, id_category: number): Promise<boolean>{
        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE category SET name = ?, description = ?, image = ? WHERE id_category = ?`,
            [query.name, query.description, query.image, id_category]
        );

        return result.affectedRows > 0;
    }

    async delete(id_category: number): Promise<boolean>{
        const [result] = await pool.query<ResultSetHeader>('DELETE FROM category WHERE id_category = ?', [id_category])

        return result.affectedRows > 0;
    }


    private buildFilters(query: CategoryPaginatedQueryPayload): { where: string; params: unknown[] } {
        let where = 'WHERE 1=1';
        const params = [];

        if (query.name) {
            where += ' AND c.name LIKE ?';
            params.push(`%${query.name}%`);
        }

        return { where, params };
    }

}