import { Router } from 'express';
import { GameController } from '../controllers/game.Controller.js';
import { authMiddleware } from '../middlewares/auth.Middleware.js';
import { adminMiddleware } from '../middlewares/admin.Middleware.js';
import { GameService } from '../services/game.Service.js';

const gameService = GameService.getInstance();
const gameController = new GameController(gameService);

const router = Router();

router.get('/pag', gameController.getGamesPaginated); // Usuário Lista os jogos
router.get('/pagadmin', authMiddleware, adminMiddleware, gameController.getGamesAdminPaginated); // Admin - Lista os jogos
router.get('/:id', gameController.getGameById); // Usuário Busca o jogo
router.get('/', authMiddleware, adminMiddleware, gameController.getGames);  // só pra completar o crud
router.post('/', authMiddleware, adminMiddleware, gameController.createGame); // Admin - Cria jogo
router.put('/:id', authMiddleware, adminMiddleware, gameController.updateGame); // Admin - Atualiza jogo
router.delete('/:id', authMiddleware, adminMiddleware, gameController.deleteGame); // Admin - Deleta jogo

export default router;