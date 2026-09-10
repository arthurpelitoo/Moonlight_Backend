import express from 'express';
import authMiddleware from '../middlewares/auth.Middleware.js';
import { checkoutController } from '../config/container.js';
import { roleMiddleware } from '../middlewares/role.Middleware.js';
import { requireUser } from '../config/allowedRoles.js';

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(requireUser), checkoutController.createCheckout);
router.post('/webhook', checkoutController.handleWebhook);
router.get('/success', checkoutController.handleSuccess);
router.get('/failure', checkoutController.handleFailure);
router.get('/pending', checkoutController.handlePending);

export default router;
