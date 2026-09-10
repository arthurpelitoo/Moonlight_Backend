import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.Middleware.js';
import { gameController } from '../config/container.js';
import { errorMiddleware } from '../middlewares/error.Middleware.js';
import { roleMiddleware } from '../middlewares/role.Middleware.js';
import { requireAdmin } from '../config/allowedRoles.js';

const router = Router();

router.get('/pag', gameController.getGamesPaginated); // Usuário Lista os jogos
router.get('/pagadmin', authMiddleware, roleMiddleware(requireAdmin), gameController.getGamesAdminPaginated); // Admin - Lista os jogos
router.get('/:id', gameController.getGameById); // Usuário Busca o jogo
router.get('/', authMiddleware, roleMiddleware(requireAdmin), gameController.getGames);  // só pra completar o crud
router.post('/', authMiddleware, roleMiddleware(requireAdmin), gameController.createGame, errorMiddleware); // Admin - Cria jogo
router.put('/:id', authMiddleware, roleMiddleware(requireAdmin), gameController.updateGame); // Admin - Atualiza jogo
router.delete('/:id', authMiddleware, roleMiddleware(requireAdmin), gameController.deleteGame); // Admin - Deleta jogo

export default router;
