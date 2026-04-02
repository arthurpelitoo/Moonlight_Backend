import { Router } from 'express';
import { login, registerUser } from '../controllers/auth.Controller.js';
import { createUser } from '../controllers/user.Controller.js';

const router = Router();

router.post('/auth/login', login);
router.get('/users', );
router.get('/users/:id', login);
router.post('/users', createUser)
router.delete('/delete', login);

////////////////////////////////

router.post('/register', registerUser);
router.get('/register', registerUser);
router.put('/register', registerUser);
router.delete('/register', registerUser);

export default router; 
