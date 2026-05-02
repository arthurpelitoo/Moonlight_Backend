import type { CartItem } from "../common/cartItem.js"

export type CreateCheckoutDTO = {
    items: CartItem[],
    total: number,
    user: {
        id_user: number,
        name: string
    }
}

export type MercadoPagoWebhookDTO = {
  type: "payment" | "subscription" | "plan" | string;
  data: {
    id: string;
  };
};