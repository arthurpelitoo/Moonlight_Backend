import { jest } from "@jest/globals";
import type { GameRepository } from "../../repositories/GameRepository.js";
import type {
  FilterParams,
  QueryOptions,
} from "../../@types/common/pagination.js";
import type { Game } from "../../@types/game/repository/game.repository.js";
import type {
  CreateGameDTO,
  UpdateGameDTO,
} from "../../@types/game/dto/game.input.dto.js";
import type { Pool, PoolConnection } from "mysql2/promise";

const { GameService } = await import("../../services/game.Service.js");

const mockPoolConnection = {
  beginTransaction: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
  commit: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
  rollback: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
  release: jest.fn<() => void>(),
} as unknown as PoolConnection;

const mockPool = {
  getConnection: jest.fn<() => Promise<PoolConnection>>(),
} as unknown as Pool;

const mockGameRepository = {
  findAllPaginated: jest.fn<(options: QueryOptions) => Promise<Game[]>>(),
  count: jest.fn<(params: FilterParams) => Promise<number>>(),
  findAll: jest.fn<() => Promise<Game[]>>(),
  findById: jest.fn<() => Promise<Game>>(),
  create: jest.fn<(query: CreateGameDTO) => Promise<number>>(),
  update: jest.fn<(query: UpdateGameDTO) => Promise<boolean>>(),
  delete: jest.fn<(id_game: number) => Promise<boolean>>(),
  replaceCategories:
    jest.fn<
      (
        id_game: number,
        categories?: number[],
        connection?: PoolConnection,
      ) => Promise<void>
    >(),
} as unknown as GameRepository;

describe("GameService - Unitário", () => {
  const service = new GameService(mockGameRepository, mockPool);

  const mockSearchAllPaginated =
    mockGameRepository.findAllPaginated as jest.MockedFunction<
      (options: QueryOptions) => Promise<Game[]>
    >;

  const mockCount = mockGameRepository.count as jest.MockedFunction<
    (params: FilterParams) => Promise<number>
  >;

  const mockSearchAll = mockGameRepository.findAll as jest.MockedFunction<
    () => Promise<Game[]>
  >;

  const mockSearchById = mockGameRepository.findById as jest.MockedFunction<
    (id_game: number) => Promise<Game | null>
  >;

  const mockCreateGame = mockGameRepository.create as jest.MockedFunction<
    (query: CreateGameDTO) => Promise<number>
  >;

  const mockUpdateGame = mockGameRepository.update as jest.MockedFunction<
    (query: UpdateGameDTO) => Promise<boolean>
  >;

  const mockDeleteGame = mockGameRepository.delete as jest.MockedFunction<
    (id_game: number) => Promise<boolean>
  >;

  const mockReplaceCategories =
    mockGameRepository.replaceCategories as jest.MockedFunction<
      (
        id_game: number,
        categories?: number[],
        connection?: PoolConnection,
      ) => Promise<void>
    >;

  beforeEach(() => {
    jest.clearAllMocks();
    (
      mockPool.getConnection as jest.MockedFunction<
        () => Promise<PoolConnection>
      >
    ).mockResolvedValue(mockPoolConnection);
  });

  describe("findAllPaginated", () => {
    it("deve retornar lista de jogos", async () => {
      mockSearchAllPaginated.mockResolvedValueOnce([
        {
          id_game: 1,
          title: "Jogo A",
          price: 50,
          active: true,
          launch_date: new Date("2000-02-25"),
        },
      ]);
      mockCount.mockResolvedValueOnce(1);

      const game = await service.findAllPaginated({
        page: 1,
        limit: 8,
        random: false,
      });

      expect(game.data).toHaveLength(1);
    });

    it("deve aplicar filtro de titulo quando fornecido", async () => {
      mockSearchAllPaginated.mockResolvedValueOnce([]);
      mockCount.mockResolvedValueOnce(0);

      await service.findAllPaginated({
        page: 1,
        limit: 8,
        random: false,
        title: "FarCry3",
      });

      expect(mockSearchAllPaginated).toHaveBeenCalledWith(
        expect.objectContaining({
          filters: expect.objectContaining({
            dbParams: expect.arrayContaining(["%FarCry3%"]),
          }),
        }),
      );
    });

    it("deve usar ORDER BY RAND() quando random = true", async () => {
      mockSearchAllPaginated.mockResolvedValueOnce([]);
      mockCount.mockResolvedValueOnce(0);

      await service.findAllPaginated({ page: 1, limit: 8, random: true });

      expect(mockSearchAllPaginated).toHaveBeenCalledWith(
        expect.objectContaining({
          filters: expect.objectContaining({
            order: "RAND(0)",
          }),
        }),
      );
    });

    it("deve calcular offset corretamente na página 3", async () => {
      mockSearchAllPaginated.mockResolvedValueOnce([]);
      mockCount.mockResolvedValueOnce(0);

      await service.findAllPaginated({ page: 3, limit: 8, random: false });

      expect(mockSearchAllPaginated).toHaveBeenCalledWith(
        expect.objectContaining({
          pagination: expect.objectContaining({
            offset: 16,
          }),
        }),
      );
    });
  });

  describe("findAll", () => {
    it("deve retornar lista de jogos", async () => {
      mockSearchAll.mockResolvedValueOnce([
        {
          id_game: 1,
          title: "Jogo A",
          price: 50,
          active: true,
          launch_date: new Date("2000-02-25"),
        },
        {
          id_game: 2,
          title: "Jogo B",
          price: 30,
          active: true,
          launch_date: new Date("2005-07-12"),
        },
      ]);

      const games = await service.findAll();

      expect(games).not.toBeNull();
      expect(games).toHaveLength(2);
    });
    it("deve retornar array vazio se não houver jogos", async () => {
      mockSearchAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toHaveLength(0);
    });
  });

  describe("findById", () => {
    it("deve retornar jogo com categorias como array", async () => {
      mockSearchById.mockResolvedValueOnce({
        id_game: 1,
        title: "Jogo A",
        price: 50,
        active: true,
        launch_date: new Date("2000-02-25"),
        categories: ["Ação", "RPG"],
      });

      const game = await service.findById(1);

      expect(game).not.toBeNull();
      expect(game!.categories).toEqual(["Ação", "RPG"]);
    });

    it("deve retornar null se jogo não existir", async () => {
      mockSearchById.mockResolvedValue(null);
      const result = await service.findById(999);
      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    const createPayload: CreateGameDTO = {
      title: "Novo Jogo",
      price: 79.99,
      launch_date: new Date("2024-01-01"),
      active: true,
      categories: [],
    };

    it("deve retornar o id do jogo criado", async () => {
      mockCreateGame.mockResolvedValue(7);
      mockReplaceCategories.mockResolvedValue(undefined);

      const id = await service.create(createPayload);

      expect(id).toBe(7);
    });

    it("deve inserir categorias se enviadas", async () => {
      mockCreateGame.mockResolvedValue(8);
      mockReplaceCategories.mockResolvedValue(undefined);

      await service.create({ ...createPayload, categories: [1, 2] });

      expect(mockReplaceCategories).toHaveBeenCalledTimes(1);
      expect(mockReplaceCategories).toHaveBeenCalledWith(
        8, // id_game retornado pelo create
        [1, 2], // categorias enviadas
        mockPoolConnection,
      );
    });
    it("deve executar dentro de uma transação", async () => {
      mockCreateGame.mockResolvedValue(8);
      mockReplaceCategories.mockResolvedValue(undefined);

      await service.create(createPayload);

      expect(mockPoolConnection.beginTransaction).toHaveBeenCalledTimes(1);
      expect(mockPoolConnection.commit).toHaveBeenCalledTimes(1);
      expect(mockPoolConnection.rollback).not.toHaveBeenCalled();
      expect(mockPoolConnection.release).toHaveBeenCalledTimes(1);
    });
    it("deve fazer rollback e propagar erro se create falhar", async () => {
      mockCreateGame.mockRejectedValue(new Error("DB error"));

      await expect(service.create(createPayload)).rejects.toThrow("DB error");

      expect(mockPoolConnection.rollback).toHaveBeenCalledTimes(1);
      expect(mockPoolConnection.commit).not.toHaveBeenCalled();
      expect(mockPoolConnection.release).toHaveBeenCalledTimes(1); // finally sempre roda
    });
  });

  describe("update", () => {
    const updatePayload: UpdateGameDTO = {
      id_game: 1,
      title: "Atualizado",
      price: 30,
      launch_date: new Date("2024-01-01"),
      active: true,
      categories: [],
    };

    it("deve retornar true se o jogo foi atualizado", async () => {
      mockUpdateGame.mockResolvedValue(true);

      const result = await service.update(updatePayload);

      expect(result).toBe(true);
    });

    it("deve retornar false se jogo não encontrado", async () => {
      mockUpdateGame.mockResolvedValue(false);
      const result = await service.update({ ...updatePayload, id_game: 999 });
      expect(result).toBe(false);
    });

    it("deve fazer rollback e propagar erro se update falhar", async () => {
      mockUpdateGame.mockRejectedValue(new Error("DB error"));

      await expect(service.update(updatePayload)).rejects.toThrow("DB error");

      expect(mockPoolConnection.rollback).toHaveBeenCalledTimes(1);
      expect(mockPoolConnection.release).toHaveBeenCalledTimes(1);
    });
  });

  describe("delete", () => {
    it("deve retornar true se deletou", async () => {
      mockDeleteGame.mockResolvedValue(true);
      const result = await service.delete(1);
      expect(result).toBe(true);
    });

    it("deve retornar false se não encontrou", async () => {
      mockDeleteGame.mockResolvedValue(false);
      const result = await service.delete(999);
      expect(result).toBe(false);
    });
  });
});
