import { Router } from 'express';
import { getAllOrders, getMyOrders, getOrderById, createOrder, updateOrderStatus } from '../controllers/order.Controller.js';
import { authMiddleware } from '../middlewares/auth.Middleware.js';
import { adminMiddleware } from '../middlewares/admin.Middleware.js';

const router = Router();

router.get('/my-orders', authMiddleware, getMyOrders);                         // Usuário logado
router.get('/', authMiddleware, adminMiddleware, getAllOrders);                 // Admin
router.get('/:id', authMiddleware, getOrderById);                              // Admin ou dono
router.post('/', authMiddleware, createOrder);                                 // Usuário logado
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus); // Admin

export default router;