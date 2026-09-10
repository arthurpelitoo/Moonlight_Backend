import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.Middleware.js';
import { uploadController } from '../config/container.js';
import { uploadMiddleware } from '../middlewares/upload.Middleware.js';
import { roleMiddleware } from '../middlewares/role.Middleware.js';
import { requireAdmin } from '../config/allowedRoles.js';

const router = Router();

router.post('/:context', authMiddleware, roleMiddleware(requireAdmin), uploadMiddleware, uploadController.uploadImage);

export default router;
