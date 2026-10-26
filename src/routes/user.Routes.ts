import { Router } from 'express';
import authMiddleware from '../middlewares/auth.Middleware.js';
import { userController } from '../config/container.js';
import { roleMiddleware } from '../middlewares/role.Middleware.js';
import { requireAdmin, requireUser } from '../config/allowedRoles.js';

const router = Router();

router.get('/pag', authMiddleware, roleMiddleware(requireAdmin), userController.getUsersPaginated);
router.get('/:id', authMiddleware, roleMiddleware(requireAdmin), userController.getUserById);
router.get('/', authMiddleware, roleMiddleware(requireAdmin), userController.getUsers);
router.post('/', authMiddleware, roleMiddleware(requireAdmin), userController.createUser);
router.put('/me', authMiddleware, roleMiddleware(requireUser), userController.updateMe);
router.put('/:id', authMiddleware, roleMiddleware(requireAdmin), userController.updateUser);
router.delete('/:id', authMiddleware, roleMiddleware(requireAdmin), userController.deleteUser);

export default router;
