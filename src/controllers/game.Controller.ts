import type { Request, Response } from 'express';
import pool from '../config/database.js';
import type { GameService } from '../services/game.Service.js';
import type { GameDTO, GamePaginatedQueryPayload, GameQueryPayload } from '../@types/index.js';
import type { ResultSetHeader } from 'mysql2';
import { isPriceValid } from '../utils/Validators/gameValidators.js';

export class GameController{

  constructor(private gameService: GameService){} 

  getGamesPaginated = async (req: Request, res: Response): Promise<Response> => {
    try {
      const buildQuery = (): GamePaginatedQueryPayload => ({
          page: parseInt(req.query.page as string) || 1,
          limit: parseInt(req.query.limit as string) || 8,
          random: req.query.random === 'true',
          title: req.query.title as string || undefined,
          category: req.query.category as string || undefined,
          launch_date_from: (req.query.launch_date_from as string) || undefined,
          launch_date_to: (req.query.launch_date_to as string) || undefined,
          price_min: parseFloat(req.query.price_min as string) || undefined,
          price_max: parseFloat(req.query.price_max as string) || undefined
      })
      
      const result = await this.gameService.findAllPaginated(buildQuery());
      if(!result) return res.status(404).json({ message: 'Jogos paginados não encontrados' });

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar jogos paginados', error });
    }
  };

  getGamesAdminPaginated = async (req: Request, res: Response): Promise<Response> => {
    try {
      const buildQuery = (): GamePaginatedQueryPayload => ({
          page: parseInt(req.query.page as string) || 1,
          limit: parseInt(req.query.limit as string) || 8,
          random: req.query.random === 'true',
          title: req.query.title as string || undefined,
          category: req.query.category as string || undefined,
          launch_date_from: (req.query.launch_date_from as string) || undefined,
          launch_date_to: (req.query.launch_date_to as string) || undefined,
          price_min: parseFloat(req.query.price_min as string) || undefined,
          price_max: parseFloat(req.query.price_max as string) || undefined,
          active: req.query.active !== undefined ? req.query.active === 'true' : undefined,
          admin: true
      })
      
      const result = await this.gameService.findAllPaginated(buildQuery());
      if(!result) return res.status(404).json({ message: 'Jogos paginados não encontrados' });

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar jogos paginados', error });
    }
  };

  getGames = async (req: Request, res: Response): Promise<Response> => {
    try {
      
      const result = await this.gameService.findAll();
      if(!result) return res.status(404).json({ message: 'Jogos não encontrados' });

      return res.status(200).json(result as GameDTO[]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar jogos', error });
    }
  };

  // busca os jogos pelo seu id
  getGameById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const gameId = parseInt(req.params.id ?? '0');
      if (!gameId) return res.status(400).json({ message: 'ID inválido' });

      const data = await this.gameService.findById(gameId);
      if (!data) return res.status(404).json({ message: 'Jogo não encontrado' });
      
      return res.status(200).json(data as GameDTO);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar jogo', error });
    }
  };

  // Cria os jogos pelo comando do (admin) 
  createGame = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { title, description, price, image, banner_image, link, launch_date, active, categories } = req.body;

      if (!title || !isPriceValid(price) || !launch_date || active === undefined ) return res.status(400).json({ message: 'titulo, preço, data de lançamento e ativo são obrigatórios' });

      const buildQuery = (): GameQueryPayload => ({title, description, price, image, banner_image, link, launch_date, active, categories})
      const newGameId = await this.gameService.create(buildQuery());

      return res.status(201).json({ message: 'Jogo criado com sucesso!', id_game: newGameId });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao criar jogo', error });
    }
  };

  // atyaliza o jogo pelos comandos de um (Admin)
  updateGame = async (req: Request, res: Response): Promise<Response> => {
    try {

      const { id } = req.params;
      const id_game = parseInt(id as string);
      const { title, description, price, image, banner_image, link, launch_date, active, categories } = req.body;

      if (!title || !isPriceValid(price) || !launch_date || active === undefined) return res.status(400).json({ message: 'titulo, preço, data de lançamento e ativo são obrigatórios' });

      const buildQuery = (): GameQueryPayload => ({title, description, price, image, banner_image, link, launch_date, active, categories})

      // Trigger de auditoria de preço dispara automaticamente no banco
      await pool.query<ResultSetHeader>('SET @usuario_logado = ?', [req.user?.id_user]);

      const result = await this.gameService.update(buildQuery(), id_game);
      if(!result) return res.status(404).json({ message: 'Jogo não encontrado' });

      return res.status(200).json({ message: 'Jogo atualizado com sucesso!' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao atualizar jogo', error });
    }
  };

  // Deleta o jogo pelos comandos de (admin) 
  deleteGame = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const id_game = parseInt(id as string);

      const result = await this.gameService.delete(id_game);
      if(!result) return res.status(404).json({ message: 'Jogo não encontrado' });

      return res.status(200).json({ message: 'Jogo deletado com sucesso!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao deletar jogo', error });
    }
  };
}
