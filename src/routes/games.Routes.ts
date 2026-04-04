import { Router } from 'express';
import { getGames, getGameById, createGame, updateGame, deleteGame } from '../controllers/game.Controller.js';
import { authMiddleware } from '../middlewares/auth.Middleware.js';
import { adminMiddleware } from '../middlewares/admin.Middleware.js';

const router = Router();

router.get('/', getGames);      // Usuário Lista os jogos
router.get('/:id', getGameById); // Usuário Busca o jogo
router.post('/', authMiddleware, adminMiddleware, createGame); // Admin - Cria jogo
router.put('/:id', authMiddleware, adminMiddleware, updateGame); // Admin - Atualiza jogo
router.delete('/:id', authMiddleware, adminMiddleware, deleteGame); // Admin - Deleta jogo

export default router;