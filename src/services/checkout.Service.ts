import {MercadoPagoConfig,  Payment,  Preference } from "mercadopago";
import type { CartItem, CheckoutQueryPayload, OrderQueryPayload, PurchasedItemsQueryPayload } from "../@types/index.js";
import pool from "../config/database.js";
import type { ResultSetHeader } from "mysql2";
import { OrderService } from "./order.Service.js";
import { PurchasedItemsService } from "./purchasedItems.Service.js";


export class CheckoutService{
    private static instance: CheckoutService;
    private orderService = OrderService.getInstance();
    private purchasedItemsService = PurchasedItemsService.getInstance();

    private constructor() {}

        static getInstance(): CheckoutService{
            if(!CheckoutService.instance) CheckoutService.instance = new CheckoutService();
            return CheckoutService.instance;
        }
        

        async createPreference(query: CheckoutQueryPayload): Promise<string | undefined>{
            const client = new MercadoPagoConfig({accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!});
            const preference = new Preference(client);

            const external_reference = `order_${Date.now()}`;

            const result = await preference.create({
                body: {
                    payer: {
                        name: query.user.name,
                        email: "TESTUSER8052695651117258427@testuser.com" // teste
                    },
                    items: query.items.map((item: CartItem) => ({
                        id: String(item.id_game),
                        title: item.title,
                        quantity: 1,
                        currency_id: "BRL",
                        unit_price: Number(item.price)
                    })),
                    external_reference,
                    back_urls: {
                        success: `${process.env.NGROK_URL}/api/checkout/success`,
                        failure: `${process.env.NGROK_URL}/api/checkout/failure`,
                        pending: `${process.env.NGROK_URL}/api/checkout/pending`
                    },
                    auto_return: "approved",
                    notification_url: `${process.env.NGROK_URL}/api/checkout/webhook`,
                }
            });
            const preference_id = result.id;

            const buildOrderQuery = () : OrderQueryPayload => ({ status: 'pending', preference_id, external_reference, id_user: query.user.id_user, total: query.total })
            const id_order = await this.orderService.createOrder(buildOrderQuery());

            const buildPurchasedItemsQuery = () : PurchasedItemsQueryPayload => ({id_order, items: query.items})
            await this.purchasedItemsService.createItems(buildPurchasedItemsQuery());
            
            return preference_id;
        }

        async getPaymentStatus(payment_id: string): Promise<void> {
            const client = new MercadoPagoConfig({ 
                accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
            });

            const paymentClient = new Payment(client);
            const payment = await paymentClient.get({ id: payment_id });

            const statusMap: Record<string, string> = {
                approved: 'approved',
                pending:  'pending',
                rejected: 'canceled',
                cancelled:'canceled',
            };

            const novoStatus = statusMap[payment.status ?? ''] ?? 'pending';
            const external_reference = payment.external_reference;

            const buildOrderQuery = () : Omit<OrderQueryPayload, "preference_id" | "total" > => ({external_reference, status: novoStatus})

            await this.orderService.updateOrder(buildOrderQuery())
        }
}