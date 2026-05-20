import { jest } from "@jest/globals";
import type { CreatePurchasedItemsDTO } from "../../@types/purchasedItem/purchasedItem.dto.js";
import type { PurchasedItemsRepository } from "../../repositories/PurchasedItemsRepository.js";

// Mock do pool ANTES de importar o service
jest.unstable_mockModule("../../config/database.js", () => ({
  default: { query: jest.fn() },
}));

const { PurchasedItemsService } =
  await import("../../services/purchasedItems.Service.js");

const mockPurchasedItemsRepository = {
  createItem: jest.fn<(query: CreatePurchasedItemsDTO) => Promise<void>>(),
} as unknown as PurchasedItemsRepository;

describe("PurchasedItemsService - Unitário", () => {
  const service = new PurchasedItemsService(mockPurchasedItemsRepository);

  const mockCreateItem =
    mockPurchasedItemsRepository.createItem as jest.MockedFunction<
      (query: CreatePurchasedItemsDTO) => Promise<void>
    >;

  beforeEach(() => {
    mockCreateItem.mockReset();
  });

  it("deve inserir cada item da lista no banco", async () => {
    mockCreateItem.mockResolvedValue(undefined);

    await service.createItems({
      id_order: 10,
      items: [
        { title: "carlos", id_game: 1, price: 59.99 },
        { title: "carlos", id_game: 2, price: 29.99 },
      ],
    });

    expect(mockCreateItem).toHaveBeenCalledTimes(2);

    expect(mockCreateItem).toHaveBeenNthCalledWith(1, {
      id_game: 1,
      id_order: 10,
      price: 59.99,
    });
    expect(mockCreateItem).toHaveBeenNthCalledWith(2, {
      id_game: 2,
      id_order: 10,
      price: 29.99,
    });
  });

  it("deve não chamar query se a lista de items estiver vazia", async () => {
    await service.createItems({ id_order: 10, items: [] });
    expect(mockCreateItem).not.toHaveBeenCalled();
  });

  it("deve propagar erro se o banco falhar", async () => {
    mockCreateItem.mockRejectedValue(new Error("DB error"));

    await expect(
      service.createItems({
        id_order: 1,
        items: [{ title: "carlos", id_game: 1, price: 10 }],
      }),
    ).rejects.toThrow("DB error");
  });
});
