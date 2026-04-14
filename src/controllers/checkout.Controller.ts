import type { Request, Response } from 'express';
import type { CheckoutQueryPayload } from '../@types/index.js';
import type { CheckoutService } from '../services/checkout.Service.js';

export class CheckoutController{

    constructor(private checkoutService: CheckoutService){}

    createCheckout = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { items, total, user } = req.body;
            // items: [{ id_game, title, price }]

            const buildQuery = (): CheckoutQueryPayload => ({items, total, user});

            const preference_id = await this.checkoutService.createPreference(buildQuery());

            return res.status(200).json({ preference_id });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao criar preferência' });
        }
    };

    handleWebhook = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { type, data } = req.body;

            if (type !== 'payment') return res.status(204).send();

            const payment_id = data?.id;
            if (!payment_id) return res.status(204).send();

            const preference_id = await this.checkoutService.getPaymentStatus(payment_id);
            return res.status(200).json(preference_id);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro no webhook' });
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