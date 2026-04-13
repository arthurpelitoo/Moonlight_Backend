import { Router } from 'express';
import { CategoryController } from '../controllers/category.Controller.js';
import { authMiddleware } from '../middlewares/auth.Middleware.js';
import { adminMiddleware } from '../middlewares/admin.Middleware.js';
import { CategoryService } from '../services/category.Service.js';

const categoryService = CategoryService.getInstance();
const categoryController = new CategoryController(categoryService);

const router = Router();

router.get('/pag', categoryController.getCategoriesPaginated); // Usuário Lista as categorias
router.get('/:id', categoryController.getCategoryById); // Usuário Busca a categoria
router.get('/', authMiddleware, adminMiddleware, categoryController.getCategories);  // só pra completar o crud
router.post('/', authMiddleware, adminMiddleware, categoryController.createCategory); // Admin - Cria categoria
router.put('/:id', authMiddleware, adminMiddleware, categoryController.updateCategory); // Admin - Atualiza categoria
router.delete('/:id', authMiddleware, adminMiddleware, categoryController.deleteCategory); // Admin - Deleta categoria

export default router;