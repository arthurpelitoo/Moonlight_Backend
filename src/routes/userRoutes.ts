import express from 'express';
import { getUsers, updateUser, createUser } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', createUser);
router.get('/', getUsers);
router.put('/:id', authMiddleware, updateUser);

export default router;