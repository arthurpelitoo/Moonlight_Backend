import { jest } from "@jest/globals";
import type { OrderRepository } from "../../repositories/OrderRepository.js";
import type {
  CreateOrderDTO,
  UpdateOrderDTO,
} from "../../@types/order/dto/order.input.dto.js";
import type { PurchasedItemsRepository } from "../../repositories/PurchasedItemsRepository.js";
import type { CreatePurchasedItemsDTO } from "../../@types/purchasedItem/purchasedItem.dto.js";

const mockPreferenceCreate = jest.fn<(...args: any[]) => Promise<any>>();
const mockPaymentGet = jest.fn<(...args: any[]) => Promise<any>>();

jest.unstable_mockModule("mercadopago", () => ({
  MercadoPagoConfig: jest.fn(),
  Preference: jest.fn().mockImplementation(() => ({
    create: mockPreferenceCreate,
  })),
  Payment: jest.fn().mockImplementation(() => ({
    get: mockPaymentGet,
  })),
}));

const { OrderService } = await import("../../services/order.Service.js");
const { PurchasedItemsService } =
  await import("../../services/purchasedItems.Service.js");
const { Preference, Payment } = await import("mercadopago");
const { CheckoutService } = await import("../../services/checkout.Service.js");

const mockOrderRepository = {
  canPurchaseGame:
    jest.fn<(id_user: number, id_game: number) => Promise<boolean>>(),
  create: jest.fn<(query: CreateOrderDTO) => Promise<number>>(),
  updateStatus: jest.fn<(query: UpdateOrderDTO) => Promise<boolean>>(),
} as unknown as OrderRepository;

const mockPurchasedItemsRepository = {
  createItem: jest.fn<(query: CreatePurchasedItemsDTO) => Promise<void>>(),
} as unknown as PurchasedItemsRepository;

describe("CheckoutService - Unitário", () => {
  const service = new CheckoutService(
    new OrderService(mockOrderRepository),
    new PurchasedItemsService(mockPurchasedItemsRepository),
  );

  const mockCanPurchaseGame =
    mockOrderRepository.canPurchaseGame as jest.MockedFunction<
      (id_user: number, id_game: number) => Promise<boolean>
    >;
  const mockCreateOrder = mockOrderRepository.create as jest.MockedFunction<
    (query: CreateOrderDTO) => Promise<number>
  >;
  const mockUpdateOrderStatus =
    mockOrderRepository.updateStatus as jest.MockedFunction<
      (query: UpdateOrderDTO) => Promise<boolean>
    >;

  const mockCreatePurchasedItems =
    mockPurchasedItemsRepository.createItem as jest.MockedFunction<
      (query: CreatePurchasedItemsDTO) => Promise<void>
    >;

  beforeEach(() => {
    mockCanPurchaseGame.mockReset();
    mockCreateOrder.mockReset();
    mockUpdateOrderStatus.mockReset();
    mockCreatePurchasedItems.mockReset();
    mockPreferenceCreate.mockReset();
    mockPaymentGet.mockReset();
  });

  describe("createPreference", () => {
    const checkoutPayload = {
      user: { id_user: 1, name: "João", email: "joao@email.com" },
      total: 89.98,
      items: [
        { id_game: 1, title: "Jogo A", price: 59.99 },
        { id_game: 2, title: "Jogo B", price: 29.99 },
      ],
    };

    it("deve retornar o id da preferência criada", async () => {
      mockCanPurchaseGame.mockResolvedValue(true);
      mockPreferenceCreate.mockResolvedValue({ id: "pref_123" });
      mockCreateOrder.mockResolvedValue(42);
      mockCreatePurchasedItems.mockResolvedValue(undefined);

      const result = await service.createPreference(checkoutPayload);

      expect(result).toBe("pref_123");
    });

    it("deve criar o pedido com os dados corretos", async () => {
      mockCanPurchaseGame.mockResolvedValue(true);
      mockPreferenceCreate.mockResolvedValue({ id: "pref_abc" });
      mockCreateOrder.mockResolvedValue(10);
      mockCreatePurchasedItems.mockResolvedValue(undefined);

      await service.createPreference(checkoutPayload);

      expect(mockCreateOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          id_user: 1,
          total: 89.98,
          preference_id: "pref_abc",
          status: "pending",
        }),
      );
    });

    it("deve criar os itens comprados com o id_order retornado", async () => {
      mockCanPurchaseGame.mockResolvedValue(true);
      mockPreferenceCreate.mockResolvedValue({ id: "pref_abc" });
      mockCreateOrder.mockResolvedValue(99);
      mockCreatePurchasedItems.mockResolvedValue(undefined);

      await service.createPreference(checkoutPayload);

      expect(mockCreatePurchasedItems).toHaveBeenCalledTimes(2);
      expect(mockCreatePurchasedItems).toHaveBeenCalledWith(
        expect.objectContaining({ id_order: 99, id_game: 1 }),
      );
      expect(mockCreatePurchasedItems).toHaveBeenCalledWith(
        expect.objectContaining({ id_order: 99, id_game: 2 }),
      );
    });

    it("deve propagar erro se a criação da preferência falhar", async () => {
      mockCanPurchaseGame.mockResolvedValue(true);
      mockPreferenceCreate.mockRejectedValue(new Error("MP error"));

      await expect(service.createPreference(checkoutPayload)).rejects.toThrow(
        "MP error",
      );
    });

    it("deve propagar erro se createOrder falhar", async () => {
      mockCanPurchaseGame.mockResolvedValue(true);
      mockPreferenceCreate.mockResolvedValue({ id: "pref_abc" });
      mockCreateOrder.mockRejectedValue(new Error("DB error"));

      await expect(service.createPreference(checkoutPayload)).rejects.toThrow(
        "DB error",
      );
    });
  });

  describe("getPaymentStatus", () => {
    it("deve atualizar o pedido com status approved", async () => {
      mockPaymentGet.mockResolvedValue({
        status: "approved",
        external_reference: "order_123",
      });
      mockUpdateOrderStatus.mockResolvedValue(true);

      await service.getPaymentStatus("pay_001");

      expect(mockUpdateOrderStatus).toHaveBeenCalledWith({
        status: "approved",
        external_reference: "order_123",
      });
    });

    it("deve mapear status rejected para canceled", async () => {
      mockPaymentGet.mockResolvedValue({
        status: "rejected",
        external_reference: "order_456",
      });
      mockUpdateOrderStatus.mockResolvedValue(true);

      await service.getPaymentStatus("pay_002");

      expect(mockUpdateOrderStatus).toHaveBeenCalledWith(
        expect.objectContaining({ status: "canceled" }),
      );
    });

    it("deve mapear status cancelled para canceled", async () => {
      mockPaymentGet.mockResolvedValue({
        status: "cancelled",
        external_reference: "order_789",
      });
      mockUpdateOrderStatus.mockResolvedValue(true);

      await service.getPaymentStatus("pay_003");

      expect(mockUpdateOrderStatus).toHaveBeenCalledWith(
        expect.objectContaining({ status: "canceled" }),
      );
    });

    it("deve usar status pending como fallback para status desconhecido", async () => {
      mockPaymentGet.mockResolvedValue({
        status: "in_process",
        external_reference: "order_000",
      });
      mockUpdateOrderStatus.mockResolvedValue(true);

      await service.getPaymentStatus("pay_004");

      expect(mockUpdateOrderStatus).toHaveBeenCalledWith(
        expect.objectContaining({ status: "pending" }),
      );
    });

    it("deve propagar erro se o pagamento não for encontrado", async () => {
      mockPaymentGet.mockRejectedValue(new Error("Payment not found"));

      await expect(service.getPaymentStatus("pay_invalido")).rejects.toThrow(
        "Payment not found",
      );
    });
  });
});
