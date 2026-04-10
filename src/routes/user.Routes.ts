import express from 'express';
import authMiddleware from '../middlewares/auth.Middleware.js';
import { UserService } from '../services/UserService.js';
import { UserController } from '../controllers/user.Controller.js';

const userService = UserService.getInstance();
const userController = new UserController(userService);

const router = express.Router();

router.get('/', authMiddleware, userController.getUsers);
router.post('/', authMiddleware, userController.createUser);
router.put('/me', authMiddleware, userController.updateMe);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

export default router;