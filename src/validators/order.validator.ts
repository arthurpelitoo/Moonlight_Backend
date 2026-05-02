import type { CreateOrderDTO, UpdateOrderDTO } from "../@types/order/dto/order.input.dto.js";
import { AppError } from "../utils/AppError.js";
import { isPriceValid } from "../utils/Validators/isPriceValid.js";
type validOrderStatus = "pending" | "approved" | "canceled";

    const isOrderStatusValid = (type: string): type is validOrderStatus => {
        return ['pending', 'approved', 'canceled'].includes(type as validOrderStatus);
    }

    export const assertRequiredFields = (fields: unknown[]): void => {
        if (fields.some(field => field == null || (typeof field === 'string' && !field.trim()))) 
        throw new AppError("Campos inválidos de Create ou Update de Pedido", 400, "INVALID_FIELDS");
        // o ultimo caso é pra evitar de mandarem ' '.
    }

    const assertTotalPrice = (totalPrice: number): void => {
        if(!isPriceValid(totalPrice)) throw new AppError("O preço total do pedido é inválido", 400, "INVALID_ORDER_TOTAL_PRICE");
    }

    const assertIsOrderStatusValid = (orderStatus: string): void => {
        if(!isOrderStatusValid(orderStatus)) throw new AppError("O Status de Pedido é inválido", 400, "INVALID_ORDER_STATUS");
    }

    export const validateOrderCreate = (dto: CreateOrderDTO): void => {
        assertRequiredFields([dto.id_user, dto.preference_id, dto.external_reference, dto.status, dto.total]);
        assertTotalPrice(dto.total);
        assertIsOrderStatusValid(dto.status);
    }

    export const validateOrderStatusUpdate = (dto: UpdateOrderDTO): void => {
        assertRequiredFields([dto.status]);
        assertIsOrderStatusValid(dto.status);
    }