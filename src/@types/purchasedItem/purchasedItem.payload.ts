import type { CartItem } from "../common/cartItem.js";

export interface PurchasedItemsQueryPayload {
  id_order: number;
  items: CartItem[];
}