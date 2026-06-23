import type { ResultSetHeader } from "mysql2";
import pool from "../config/database.js";
import type { FilterParams, QueryOptions } from "../@types/common/pagination.js";
import type { CreateCategoryDTO, UpdateCategoryDTO } from "../@types/category/dto/category.input.dto.js";
import type { CategoryCountRows, CategoryRow } from "../@types/category/repository/category.row.js";
import type { Category } from "../@types/category/repository/categrory.repository.js";

export class CategoryRepository{

    async findAllPaginated({filters, pagination}: QueryOptions): Promise<Category[]>{
        const [rows] = await pool.query<CategoryRow[]>(`
            SELECT c.*
            FROM category c
            ${filters.where}
            ORDER BY ${filters.order}
            LIMIT ? OFFSET ?
        `, [...filters.dbParams, pagination.limit, pagination.offset]);

        return rows;
    }

    async findAll(): Promise<Category[]>{
        const [rows] = await pool.query<CategoryRow[]>(`
            SELECT 
            c.*
            FROM category c
            GROUP BY c.id_category
        `);

        return rows;
    }

    async findById(id_category: number): Promise<Category | null>{
        const [rows] = await pool.query<CategoryRow[]>(`
            SELECT c.*
            FROM category c
            WHERE c.id_category = ?
            GROUP BY c.id_category
        `, [id_category]);

        return rows[0] ?? null;
    }

    async create(query: CreateCategoryDTO): Promise<number>{
        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO category (name, description, image)
            VALUES (?, ?, ?)`,
            [query.name, query.description, query.image]
        );

        const newCategoryId = result.insertId;
        return newCategoryId;
    }
    
    async update(query: UpdateCategoryDTO): Promise<boolean>{
        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE category SET name = ?, description = ?, image = ? WHERE id_category = ?`,
            [query.name, query.description, query.image, query.id_category]
        );

        return result.affectedRows > 0;
    }

    async delete(id_category: number): Promise<boolean>{
        const [result] = await pool.query<ResultSetHeader>('DELETE FROM category WHERE id_category = ?', [id_category])

        return result.affectedRows > 0;
    }

    async count({ where, dbParams }: FilterParams): Promise<number> {
        const [rows] = await pool.query<CategoryCountRows[]>(
            `SELECT COUNT(DISTINCT c.id_category) as total FROM category c ${where}`,
            dbParams
        );

        return rows[0]?.total ?? 0;
    }

}