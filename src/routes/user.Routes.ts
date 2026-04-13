import { Router } from 'express';
import authMiddleware from '../middlewares/auth.Middleware.js';
import { UserService } from '../services/user.Service.js';
import { UserController } from '../controllers/user.Controller.js';
import { adminMiddleware } from '../middlewares/admin.Middleware.js';

const userService = UserService.getInstance();
const userController = new UserController(userService);

const router = Router();

router.get('/pag', authMiddleware, adminMiddleware, userController.getUsersPaginated);
router.get('/:id', authMiddleware, adminMiddleware, userController.getUserById);
router.get('/', authMiddleware, adminMiddleware, userController.getUsers);
router.post('/', authMiddleware, adminMiddleware, userController.createUser);
router.put('/me', authMiddleware, userController.updateMe);
router.put('/:id', authMiddleware, adminMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser);

export default router;