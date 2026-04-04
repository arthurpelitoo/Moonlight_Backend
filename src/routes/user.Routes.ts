import { Router } from 'express';
import { getUsers, getUserById, updateUser, createUser, deleteUser } from '../controllers/user.Controller.js';
import { authMiddleware } from '../middlewares/auth.Middleware.js';

const router = Router();

router.get('/', authMiddleware, getUsers);        // Lista todos
router.get('/:id', authMiddleware, getUserById);  // Busca um por ID
router.post('/', createUser);                     // Cria usuário (sem auth)
router.put('/:id', authMiddleware, updateUser);   // Atualiza
router.delete('/:id', authMiddleware, deleteUser);// Deleta

export default router;