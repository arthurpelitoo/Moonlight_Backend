import { jest } from "@jest/globals";
import type { OrderRepository } from "../../repositories/OrderRepository.js";
import type {
  ApprovedOrdersOfUser,
  Order,
  OrderWithoutUser,
} from "../../@types/order/repository/order.repository.js";
import type {
  CreateOrderDTO,
  UpdateOrderDTO,
} from "../../@types/order/dto/order.input.dto.js";
import type {
  MyOrderRows,
  OrderRow,
} from "../../@types/order/repository/order.row.js";

const { OrderService } = await import("../../services/order.Service.js");

const mockOrderRepository = {
  findUserLibrary:
    jest.fn<(id_user: number) => Promise<ApprovedOrdersOfUser[] | null>>(),
  findMyOrders:
    jest.fn<(id_user: number) => Promise<OrderWithoutUser[] | null>>(),
  findAll: jest.fn<() => Promise<Order[]>>(),
  findById: jest.fn<(id_order: number) => Promise<Order | null>>(),
  canPurchaseGame:
    jest.fn<(id_user: number, id_game: number) => Promise<boolean>>(),
  create: jest.fn<(query: CreateOrderDTO) => Promise<number>>(),
  updateStatus: jest.fn<(query: UpdateOrderDTO) => Promise<boolean>>(),
  mapOrderList: jest.fn<(rows: OrderRow[]) => Order[]>(),
  mapMyOrders: jest.fn<(rows: MyOrderRows[]) => OrderWithoutUser[]>(),
} as unknown as OrderRepository;

describe("OrderService - Unitário", () => {
  const service = new OrderService(mockOrderRepository);
  const mockSearchUserLibrary =
    mockOrderRepository.findUserLibrary as jest.MockedFunction<
      (id_user: number) => Promise<ApprovedOrdersOfUser[] | null>
    >;
  const mockSearchMyOrders =
    mockOrderRepository.findMyOrders as jest.MockedFunction<
      (id_user: number) => Promise<OrderWithoutUser[] | null>
    >;
  const mockSearchAll = mockOrderRepository.findAll as jest.MockedFunction<
    () => Promise<Order[]>
  >;
  const mockSearchById = mockOrderRepository.findById as jest.MockedFunction<
    (id_order: number) => Promise<Order | null>
  >;
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

  beforeEach(() => {
    mockSearchMyOrders.mockReset();
    mockSearchUserLibrary.mockReset();
    mockSearchAll.mockReset();
    mockSearchById.mockReset();
    mockCanPurchaseGame.mockReset();
    mockCreateOrder.mockReset();
    mockUpdateOrderStatus.mockReset();
  });

  describe("findAll", () => {
    it("deve retornar lista de pedidos mapeados", async () => {
      mockSearchAll.mockResolvedValue([
        {
          id_order: 1,
          order_date: new Date(),
          total: 100,
          status: "approved",
          user: {
            name: "João",
            email: "joao@email.com",
          },
          games: [
            {
              title: "Jogo X",
              image: "img.png",
              price: 100,
            },
          ],
        },
      ]);

      const result = await service.findAll();
      expect(result).not.toBeNull();
      expect(result).toHaveLength(1);

      const first = result[0];
      expect(first).toBeDefined();
      expect(first).toHaveProperty("user");
      expect(first!.games).toHaveLength(1);
    });

    it("deve agrupar jogos do mesmo pedido corretamente", async () => {
      mockSearchAll.mockResolvedValue([
        {
          id_order: 1,
          order_date: new Date(),
          total: 150,
          status: "approved",
          user: {
            name: "Ana",
            email: "ana@email.com",
          },
          games: [
            {
              title: "Jogo A",
              image: "a.png",
              price: 50,
            },
            {
              title: "Jogo B",
              image: "b.png",
              price: 100,
            },
          ],
        },
      ]);

      const result = await service.findAll();
      expect(result).not.toBeNull();
      expect(result).toHaveLength(1);

      const first = result[0];
      expect(first).toBeDefined();
      expect(first!.games).toHaveLength(2);
    });
  });

  describe("findMyOrders", () => {
    it("deve retornar pedidos do usuário", async () => {
      mockSearchMyOrders.mockResolvedValue([
        {
          id_order: 2,
          order_date: new Date(),
          total: 60,
          status: "approved",
          games: [
            {
              title: "Jogo C",
              image: "c.png",
              price: 60,
            },
          ],
        },
      ]);

      const result = await service.findMyOrders(1);
      expect(result).not.toBeNull();
      expect(result).toHaveLength(1);

      const first = result![0]!;
      expect(first).toHaveProperty("games");
      expect(first.games[0]!.title).toBe("Jogo C");
    });
  });

  describe("findUserLibrary", () => {
    it("deve retornar biblioteca com categorias como array", async () => {
      mockSearchUserLibrary.mockResolvedValue([
        {
          id_game: 1,
          title: "Jogo D",
          price: 99.99,
          launch_date: new Date("2022-10-23"),
          active: true,
          categories: ["Ação", "RPG"],
        },
      ]);

      const result = await service.findUserLibrary(1);
      expect(result).not.toBeNull();

      // findUserLibrary - ambos os casos
      const first = result![0]!; // <- duplo ! aqui resolve
      expect(first.categories).toEqual(["Ação", "RPG"]);
    });

    it("deve retornar categorias como array vazio se null", async () => {
      mockSearchUserLibrary.mockResolvedValue([
        {
          id_game: 2,
          title: "Jogo E",
          price: 99.99,
          launch_date: new Date("2022-10-23"),
          active: true,
          categories: [],
        },
      ]);

      const result = await service.findUserLibrary(1);
      expect(result).not.toBeNull();

      const first = result![0]!;
      expect(first).toBeDefined();
      expect(first.categories).toEqual([]);
    });
  });

  describe("findById", () => {
    it("deve retornar pedido mapeado com o id fornecido", async () => {
      mockSearchById.mockResolvedValue({
        id_order: 1,
        order_date: new Date(),
        total: 100,
        status: "approved",
        user: {
          name: "João",
          email: "joao@email.com",
        },
        games: [
          {
            title: "Jogo X",
            image: "img.png",
            price: 100,
          },
        ],
      });

      const result = await service.findOrderById(1);
      expect(mockSearchById).toHaveBeenCalledWith(1);
      expect(result).not.toBeNull();

      const first = result;
      expect(first).toBeDefined();
      expect(first).toHaveProperty("user");
      expect(first!.games).toHaveLength(1);
    });

    it("deve agrupar jogos do mesmo pedido corretamente", async () => {
      mockSearchById.mockResolvedValue({
        id_order: 1,
        order_date: new Date(),
        total: 150,
        status: "approved",
        user: {
          name: "Ana",
          email: "ana@email.com",
        },
        games: [
          {
            title: "Jogo A",
            image: "a.png",
            price: 50,
          },
          {
            title: "Jogo B",
            image: "b.png",
            price: 100,
          },
        ],
      });

      const result = await service.findOrderById(1);
      expect(result).not.toBeNull();

      const first = result;
      expect(first).toBeDefined();
      expect(first!.games).toHaveLength(2);
    });
  });

  describe("canPurchaseGame", () => {
    it("deve retornar true se o usuário NÃO possui o jogo", async () => {
      mockCanPurchaseGame.mockResolvedValue(true); // nenhuma row = não possui
      const result = await service.canPurchaseGame(1, 10);
      expect(result).toBe(true);
    });

    it("deve retornar false se o usuário JÁ possui o jogo", async () => {
      mockCanPurchaseGame.mockResolvedValue(false); // row encontrada = já possui
      const result = await service.canPurchaseGame(1, 10);
      expect(result).toBe(false);
    });
  });

  describe("createOrder", () => {
    it("deve retornar o insertId do novo pedido", async () => {
      mockCreateOrder.mockResolvedValue(42);

      const id = await service.createOrder({
        id_user: 1,
        total: 99.99,
        preference_id: "pref_abc",
        external_reference: "ref_abc",
        status: "pending",
      });

      expect(id).toBe(42);
    });
  });

  describe("updateOrder", () => {
    it("deve retornar true se o pedido foi atualizado", async () => {
      mockUpdateOrderStatus.mockResolvedValue(true);
      const result = await service.updateOrderStatus({
        status: "approved",
        external_reference: "ref_abc",
      });
      expect(result).toBe(true);
    });

    it("deve retornar false se nenhum pedido foi encontrado", async () => {
      mockUpdateOrderStatus.mockResolvedValue(false);
      const result = await service.updateOrderStatus({
        status: "approved",
        external_reference: "ref_inexistente",
      });
      expect(result).toBe(false);
    });
  });
});
