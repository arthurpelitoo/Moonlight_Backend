import type { NextFunction, Request, Response } from 'express';
import pool from '../config/database.js';
import type { GameService } from '../services/game.Service.js';
import type { ResultSetHeader } from 'mysql2';
import type { GameQueryPayload } from '../@types/game/game.payload.js';
import type { CreateGameDTO, GetGamesPaginatedDTO, UpdateGameDTO } from '../@types/game/dto/game.input.dto.js';
import { AppError } from '../utils/AppError.js';
import { toBoolean, toFloat, toInt, toString } from '../utils/queryParser.js';
import { parseGameQuery } from '../query/parsers/gameParser.js';

export class GameController{

  constructor(private gameService: GameService){} 

  getGamesPaginated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const games = await this.gameService.findAllPaginated(parseGameQuery(req.query));
      if(!games) throw new AppError("Jogos paginados não encontrados", 404, "NOT_FOUND_GAMES_PAG");

      res.status(200).json(games);
    } catch(error) {
      next(error);
    }
  };

  getGamesAdminPaginated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const games = await this.gameService.findAllPaginated({
        ...parseGameQuery(req.query),
        active: toBoolean(req.query.active),
        admin: true
      });
      if(!games) throw new AppError("Jogos paginados não encontrados", 404, "NOT_FOUND_GAMES_PAG_ADMIN");

      res.status(200).json(games);
    } catch (error) {
      next(error);
    }
  };

  getGames = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const games = await this.gameService.findAll();
      if(!games) throw new AppError("Jogos não encontrados", 404, "NOT_FOUND_GAMES");

      res.status(200).json(games);
    } catch (error) {
      next(error);
    }
  };

  // busca os jogos pelo seu id
  getGameById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const gameId = toInt(req.params.id, 0);
      if(!gameId) throw new AppError("ID inválido", 404, "INVALID_ID");

      const game = await this.gameService.findById(gameId);
      if (!game) throw new AppError("Jogo não encontrado", 404, "NOT_FOUND_GAME");
      
      res.status(200).json(game);
    } catch (error) {
      next(error)
    }
  };

  // Cria os jogos pelo comando do (admin) 
  createGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateGameDTO;

      await this.gameService.create(dto);

      res.status(201).json({ message: 'Jogo criado com sucesso!'});
    } catch (error) {
      next(error);
    }
  };

  // atyaliza o jogo pelos comandos de um (Admin)
  updateGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id_game = parseInt(req.params.id as string);
      const dto = req.body as UpdateGameDTO;

      // Trigger de auditoria de preço dispara automaticamente no banco
      await pool.query<ResultSetHeader>('SET @usuario_logado = ?', [req.user?.id_user]);

      await this.gameService.update({...dto, id_game})

      res.status(200).json({ message: 'Jogo atualizado com sucesso!' });
    } catch (error) {
      next(error);
    }
  };

  // Deleta o jogo pelos comandos de (admin) 
  deleteGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id_game = toInt(req.params.id, 0);

      const game = await this.gameService.delete(id_game);
      if(!game) throw new AppError("Jogo não encontrado", 404, "NOT_FOUND_GAME");

      res.status(200).json({ message: 'Jogo deletado com sucesso!' });
    } catch (error) {
      next(error);
    }
  };
  
}
