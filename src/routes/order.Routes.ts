import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.Middleware.js';
import { orderController } from '../config/container.js';
import { roleMiddleware } from '../middlewares/role.Middleware.js';
import { requireAdmin, requireUser } from '../config/allowedRoles.js';

const router = Router();

router.get('/my-orders', authMiddleware, roleMiddleware(requireUser), orderController.getMyOrders); // Usuário logado
router.get('/my-library', authMiddleware, roleMiddleware(requireUser), orderController.getUserLibrary);
router.get('/can-user-purchase', authMiddleware, roleMiddleware(requireUser), orderController.canUserPurchase);
router.get('/', authMiddleware, roleMiddleware(requireAdmin), orderController.getAllOrders); // Admin
router.get('/:id', authMiddleware, roleMiddleware(requireAdmin), orderController.getOrderById); // Admin
router.post('/', authMiddleware, roleMiddleware(requireUser), orderController.createOrder); // Usuário logado
router.put('/:id', authMiddleware, roleMiddleware(requireAdmin), orderController.updateOrderStatus); // Admin

export default router;
