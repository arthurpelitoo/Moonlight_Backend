import { Router } from 'express';
import { login, registerUser } from '../controllers/auth.Controller.js';

const router = Router();

router.post('/auth/login', login);
router.post('/register', registerUser);

export default router; 
