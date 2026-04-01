import { Router } from 'express';
import { login, register } from '../controllers/auth.Controller.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);

return res.status(201).json({message: 'Usuário cadastrado com sucesso!'});

export default router; 
