import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.Middleware.js';
import { categoryController } from '../config/container.js';
import { roleMiddleware } from '../middlewares/role.Middleware.js';
import { requireAdmin } from '../config/allowedRoles.js';
const router = Router();

router.get('/pag', categoryController.getCategoriesPaginated); // Usuário Lista as categorias
router.get('/:id', categoryController.getCategoryById); // Usuário Busca a categoria
router.get('/', categoryController.getCategories);  // só pra completar o crud
router.post('/', authMiddleware, roleMiddleware(requireAdmin), categoryController.createCategory); // Admin - Cria categoria
router.put('/:id', authMiddleware, roleMiddleware(requireAdmin), categoryController.updateCategory); // Admin - Atualiza categoria
router.delete('/:id', authMiddleware, roleMiddleware(requireAdmin), categoryController.deleteCategory); // Admin - Deleta categoria

export default router;
