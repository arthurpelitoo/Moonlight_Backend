import type { CreateGameDTO, GetGamesPaginatedDTO, UpdateGameDTO } from "../@types/game/dto/game.input.dto.js";
import type { PaginatedResponse } from "../@types/common/pagination.js";
import { GameRepository } from "../repositories/GameRepository.js";
import type { GameResponseDTO } from "../@types/game/dto/game.output.dto.js";
import { gameFilterConfig } from "../query/filters/gameFilterConfig.js";
import { buildSqlFilters } from "../builders/sql/sqlFilterBuilder.js";
import type { Pool } from "mysql2/promise";
import { validateGame } from "../validators/game.validator.js";

export class GameService {

    constructor(private gameRepository: GameRepository, private pool: Pool) {}

        async findAllPaginated(query: GetGamesPaginatedDTO): Promise<PaginatedResponse<GameResponseDTO>> {
            const page = query.page || 1;
            const limit = query.limit || 8;
            const offset = (page - 1) * limit;
            const order = query.random ? `RAND(${query.random_seed ?? 0})`  : 'g.id_game ASC'; // se vai randomizar ou ordenar de forma crescente

            const baseWhere = query.admin ? 'WHERE 1=1' : 'WHERE g.active = 1';

            const safeQuery = { ...query };
            if (!query.admin) delete safeQuery.active;

            const { where, params: dbParams } = buildSqlFilters(safeQuery, gameFilterConfig);
            const finalWhere = baseWhere + where.replace('WHERE 1=1', '');

            const data = await this.gameRepository.findAllPaginated({filters: {dbParams, where: finalWhere, order}, pagination: {limit, offset}})
            const total = await this.gameRepository.count({dbParams, where: finalWhere})

            return {data, total, page, totalPages: Math.ceil(total / limit)};

        }

        async findAll(): Promise<GameResponseDTO[]>{
            return this.gameRepository.findAll();
        }

        async findById(id_game: number): Promise<GameResponseDTO | null> {
            return this.gameRepository.findById(id_game);
        }

        async create(dto: CreateGameDTO): Promise<number>{
            const connection = await this.pool.getConnection();
            await connection.beginTransaction();
            try{
                validateGame(dto);
                const id_game = await this.gameRepository.create(dto, connection);
                await this.gameRepository.replaceCategories(id_game, dto.categories, connection);
                await connection.commit();
                return id_game;
            } catch(err){
                await connection.rollback();
                throw err;
            } finally {
                connection.release();
            }
        }

        async update(dto: UpdateGameDTO): Promise<boolean>{
            const connection = await this.pool.getConnection();
            await connection.beginTransaction();
            try{
                validateGame(dto);
                const updated = await this.gameRepository.update(dto, connection);
                await this.gameRepository.replaceCategories(dto.id_game, dto.categories, connection);
                await connection.commit();
                return updated;
            } catch(err){
                await connection.rollback();
                throw err; 
            } finally{
                connection.release();
            }
        }

        async delete(id_game: number): Promise<boolean>{
            return this.gameRepository.delete(id_game);
        }

}