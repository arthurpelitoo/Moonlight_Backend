import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.Middleware.js';
import { uploadController } from '../config/container.js';
import { uploadMiddleware } from '../middlewares/upload.Middleware.js';

const router = Router();

router.post('/:context', authMiddleware, uploadMiddleware, uploadController.uploadImage);

export default router;
