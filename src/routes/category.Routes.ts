import { Router } from 'express';
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/category.Controller.js';
import { authMiddleware } from '../middlewares/auth.Middleware.js';
import { adminMiddleware } from '../middlewares/admin.Middleware.js';

const router = Router();

router.get('/', getCategories);                                           // Público
router.get('/:id', getCategoryById);                                      // Público
router.post('/', authMiddleware, adminMiddleware, createCategory);         // Admin
router.put('/:id', authMiddleware, adminMiddleware, updateCategory);       // Admin
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory);    // Admin

export default router;