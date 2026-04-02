import express from 'express';
import { getUsers, updateUser, createUser, deleteUser } from '../controllers/user.Controller.js';
import authMiddleware from '../middlewares/auth.Middleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createUser);
router.get('/get', authMiddleware, getUsers);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);
router.get('/list', authMiddleware, getUsers);

export default router;