import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.Middleware.js';
import { adminMiddleware } from '../middlewares/admin.Middleware.js';
import { orderController } from '../config/container.js';

const router = Router();

router.get('/my-orders', authMiddleware, orderController.getMyOrders); // Usuário logado
router.get('/my-library', authMiddleware, orderController.getUserLibrary);
router.get('/', authMiddleware, adminMiddleware, orderController.getAllOrders); // Admin
router.get('/:id', authMiddleware, adminMiddleware, orderController.getOrderById); // Admin ou dono
router.post('/', authMiddleware, orderController.createOrder); // Usuário logado
router.put('/:id', authMiddleware, adminMiddleware, orderController.updateOrderStatus); // Admin

export default router;