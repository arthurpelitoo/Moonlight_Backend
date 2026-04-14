import express from 'express';
import { CheckoutController } from '../controllers/checkout.Controller.js';
import { CheckoutService } from '../services/checkout.Service.js';
import authMiddleware from '../middlewares/auth.Middleware.js';

const checkoutService = CheckoutService.getInstance();
const checkoutController = new CheckoutController(checkoutService);

const router = express.Router();

router.post('/', authMiddleware, checkoutController.createCheckout);
router.post('/webhook', checkoutController.handleWebhook);
router.get('/success', checkoutController.handleSuccess);
router.get('/failure', checkoutController.handleFailure);
router.get('/pending', checkoutController.handlePending);

export default router;