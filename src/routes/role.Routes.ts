import { Router } from 'express';
import authMiddleware from '../middlewares/auth.Middleware.js';
import { roleMiddleware } from '../middlewares/role.Middleware.js';
import { roleController } from '../config/container.js';
import { requireAdmin } from '../config/allowedRoles.js';

const router = Router();

router.get('/', authMiddleware, roleMiddleware(requireAdmin), roleController.getRoles);
router.patch('/user/:id', authMiddleware, roleMiddleware(requireAdmin), roleController.syncUserRoles);

export default router;
