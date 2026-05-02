import {MercadoPagoConfig,  Payment,  Preference } from "mercadopago";
import { OrderService } from "./order.Service.js";
import { PurchasedItemsService } from "./purchasedItems.Service.js";
import type { CreateCheckoutDTO } from "../@types/checkout/checkout.dto.js";
import type { PurchasedItemsDTO } from "../@types/purchasedItem/purchasedItem.dto.js";
import { AppError } from "../utils/AppError.js";
type PaymentStatus = 'approved' | 'pending' | 'canceled';

export class CheckoutService{

    constructor(
        private orderService: OrderService,
        private purchasedItemsService: PurchasedItemsService
    ) {}

        async createPreference(dto: CreateCheckoutDTO): Promise<string | undefined>{
            for (const item of dto.items) {
                const canBuy = await this.orderService.canPurchaseGame(dto.user.id_user, item.id_game);
                if (!canBuy) throw new AppError(`Você já possui o jogo "${item.title}" na sua biblioteca.`, 400, "USER_ALREADY_HAVE_GAME");
            }
            
            const client = this.createMercadoPagoClient();
            const preferenceClient = new Preference(client);

            const external_reference = this.generateExternalReference();

            const preference = await this.createMercadoPreference(preferenceClient, dto, external_reference);
            const id_order = await this.createOrder(dto, preference.id!, external_reference);

            await this.createPurchasedItems({id_order, items: dto.items} as PurchasedItemsDTO);
            
            return preference.id;
        }

        async getPaymentStatus(payment_id: string): Promise<void> {
            const client = this.createMercadoPagoClient();

            const paymentClient = new Payment(client);
            const payment = await paymentClient.get({ id: payment_id });

            const status = this.mapStatus(payment.status);

            const external_reference = payment.external_reference!;

            await this.orderService.updateOrderStatus({status, external_reference})
        }

        private createMercadoPagoClient(): MercadoPagoConfig {
            return new MercadoPagoConfig({
                accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!
            });
        }

        private generateExternalReference(): string {
            return `order_${Date.now()}`;
        }

        private async createMercadoPreference(
            preference: Preference,
            query: CreateCheckoutDTO,
            external_reference: string
        ) {
            return preference.create({
                body: {
                    payer: {
                        name: query.user.name,
                        email: "TESTUSER8052695651117258427@testuser.com"
                    },
                    items: query.items.map(item => ({
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
                    notification_url: `${process.env.NGROK_URL}/api/checkout/webhook`
                }
            });
        }

        private async createOrder(
            query: CreateCheckoutDTO,
            preference_id: string,
            external_reference: string
        ): Promise<number> {
            return this.orderService.createOrder({
                status: 'pending',
                preference_id,
                external_reference,
                id_user: query.user.id_user,
                total: query.total
            });
        }

        private async createPurchasedItems(query: PurchasedItemsDTO) {
            return this.purchasedItemsService.createItems({
                id_order: query.id_order,
                items: query.items
            });
        }

        private mapStatus(status?: string): PaymentStatus {
            const map: Record<string, PaymentStatus> = {
                approved: 'approved',
                pending:  'pending',
                rejected: 'canceled',
                cancelled:'canceled',
            };

            return map[status ?? ''] ?? 'pending';
        }
}