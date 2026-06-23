import type { NextFunction, Request, Response } from 'express';
import type { CheckoutService } from '../services/checkout.Service.js';
import type { CreateCheckoutDTO, MercadoPagoWebhookDTO } from '../@types/checkout/checkout.dto.js';
import type { OrderService } from '../services/order.Service.js';
import { AppError } from '../utils/AppError.js';

export class CheckoutController{

    constructor(
        private checkoutService: CheckoutService,
        private orderService: OrderService
    ){}

    createCheckout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dto = req.body as CreateCheckoutDTO;

            const preference_id = await this.checkoutService.createPreference(dto);

            res.status(200).json({ preference_id });
        } catch (error) {
            next(error);
        }
    };

    handleWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const body = req.body as MercadoPagoWebhookDTO;

            if (body.type !== "payment") res.sendStatus(204);

            const paymentId = body.data?.id;
            if (!paymentId) res.sendStatus(204);

            const payment = await this.checkoutService.getPaymentStatus(paymentId);

            res.status(200).json(payment);
        } catch(error) {
            next(error);
        }
    };

    handleSuccess = async (req: Request, res: Response): Promise<void> => {
        res.redirect('http://localhost:5173/checkout/success');
    };

    handleFailure = async (req: Request, res: Response): Promise<void> => {
        res.redirect('http://localhost:5173/checkout/failure');
    };

    handlePending = async (req: Request, res: Response): Promise<void> => {
        res.redirect('http://localhost:5173/checkout/pending');
    };

    // para testes EM COMPRAS DE CARTÃO:

    //credenciais de teste:

    //Cartão	    Número	                Código de segurança	    Data de vencimento
    // Mastercard    // 5031 4332 1540 6351   // 123                   // 11/30

    //Pra ser aprovado escreva no nome do titular do cartão: APRO 
    //CPF: 12345678909
    //mais detalhes em: https://www.mercadopago.com.br/developers/panel/app

    
}