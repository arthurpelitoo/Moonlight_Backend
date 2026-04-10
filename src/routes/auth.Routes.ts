import express from 'express';
import { AuthController} from '../controllers/auth.Controller.js';
import { AuthService } from '../services/AuthService.js';
import { UserService } from '../services/UserService.js';

const authService = AuthService.getInstance();
const userService = UserService.getInstance();
const authController = new AuthController(authService, userService);

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.registerUser);

export default router;