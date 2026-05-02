import { OrderRepository } from "../repositories/OrderRepository.js";
import type { OrderResponseDTO, OrderResponseLibraryDTO, OrderResponseMyOrdersDTO } from "../@types/order/dto/order.output.dto.js";
import type { CreateOrderDTO, UpdateOrderDTO } from "../@types/order/dto/order.input.dto.js";
import { validateOrderCreate, validateOrderStatusUpdate } from "../validators/order.validator.js";

export class OrderService{

    constructor(private orderRepository: OrderRepository) {}

    async findUserLibrary(id_user: number): Promise<OrderResponseLibraryDTO[] | null> {
        return this.orderRepository.findUserLibrary(id_user);
    }

    async findMyOrders(id_user: number): Promise<OrderResponseMyOrdersDTO[] | null>{
        return this.orderRepository.findMyOrders(id_user);
    }

    async findAll(): Promise<OrderResponseDTO[]>{
        return this.orderRepository.findAll();
    }

    async findOrderById(id_order: number): Promise<OrderResponseDTO | null>{
        return this.orderRepository.findById(id_order);
    }
    
    async canPurchaseGame(id_user: number, id_game: number): Promise<boolean> {
        return this.orderRepository.canPurchaseGame(id_user, id_game);
    }

    async createOrder(dto: CreateOrderDTO): Promise<number> {
        validateOrderCreate(dto)
        return this.orderRepository.create(dto);
    }

    async updateOrderStatus(dto: UpdateOrderDTO): Promise<boolean> {
        validateOrderStatusUpdate(dto);
        return this.orderRepository.updateStatus(dto);
    }

    
}