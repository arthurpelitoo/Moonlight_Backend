import { expect, jest } from "@jest/globals";
import type { CategoryRepository } from "../../repositories/CategoryRepository.js";
import type { Category } from "../../@types/category/repository/categrory.repository.js";
import type {
  FilterParams,
  QueryOptions,
} from "../../@types/common/pagination.js";
import type {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../../@types/category/dto/category.input.dto.js";

const { CategoryService } = await import("../../services/category.Service.js");

const mockCategoryRepository = {
  findAllPaginated: jest.fn<(options: QueryOptions) => Promise<Category[]>>(),
  count: jest.fn<(params: FilterParams) => Promise<number>>(),
  findAll: jest.fn<() => Promise<Category[]>>(),
  findById: jest.fn<() => Promise<Category>>(),
  create: jest.fn<(query: CreateCategoryDTO) => Promise<number>>(),
  update: jest.fn<(query: UpdateCategoryDTO) => Promise<boolean>>(),
  delete: jest.fn<(id_category: number) => Promise<boolean>>(),
} as unknown as CategoryRepository;

describe("CategoryService - Unitário", () => {
  const service = new CategoryService(mockCategoryRepository);

  const mockSearchAllPaginated =
    mockCategoryRepository.findAllPaginated as jest.MockedFunction<
      (options: QueryOptions) => Promise<Category[]>
    >;
  const mockCount = mockCategoryRepository.count as jest.MockedFunction<
    (params: FilterParams) => Promise<number>
  >;
  const mockSearchAll = mockCategoryRepository.findAll as jest.MockedFunction<
    () => Promise<Category[]>
  >;
  const mockSearchById = mockCategoryRepository.findById as jest.MockedFunction<
    (id_category: number) => Promise<Category | null>
  >;
  const mockCreateCategory =
    mockCategoryRepository.create as jest.MockedFunction<
      (query: CreateCategoryDTO) => Promise<number>
    >;
  const mockUpdateCategory =
    mockCategoryRepository.update as jest.MockedFunction<
      (query: UpdateCategoryDTO) => Promise<boolean>
    >;
  const mockDeleteCategory =
    mockCategoryRepository.delete as jest.MockedFunction<
      (id_category: number) => Promise<boolean>
    >;

  beforeEach(() => {
    (mockSearchAllPaginated.mockReset(),
      mockCount.mockReset(),
      mockSearchAll.mockReset(),
      mockSearchById.mockReset(),
      mockCreateCategory.mockReset(),
      mockUpdateCategory.mockReset(),
      mockDeleteCategory.mockReset());
  });

  describe("findAllPaginated", () => {
    it("deve retornar dados", async () => {
      mockSearchAllPaginated.mockResolvedValueOnce([
        { id_category: 1, name: "Ação", description: "" },
      ]);
      mockCount.mockResolvedValueOnce(1);

      const result = await service.findAllPaginated({
        page: 1,
        limit: 5,
        random: false,
      });

      expect(result.data).toHaveLength(1);
    });

    it("deve aplicar filtro de nome quando fornecido", async () => {
      mockSearchAllPaginated.mockResolvedValueOnce([]);
      mockCount.mockResolvedValueOnce(0);

      await service.findAllPaginated({
        page: 1,
        limit: 5,
        random: false,
        name: "RPG",
      });

      expect(mockSearchAllPaginated).toHaveBeenCalledWith(
        expect.objectContaining({
          filters: expect.objectContaining({
            dbParams: expect.arrayContaining(["%RPG%"]),
          }),
        }),
      );
    });

    it("deve usar ORDER BY RAND() quando random = true", async () => {
      mockSearchAllPaginated.mockResolvedValueOnce([]);
      mockCount.mockResolvedValueOnce(0);

      await service.findAllPaginated({ page: 1, limit: 5, random: true });

      expect(mockSearchAllPaginated).toHaveBeenCalledWith(
        expect.objectContaining({
          filters: expect.objectContaining({
            order: "RAND()",
          }),
        }),
      );
    });

    it("deve calcular offset corretamente na página 3", async () => {
      mockSearchAllPaginated.mockResolvedValueOnce([]);
      mockCount.mockResolvedValueOnce(0);

      await service.findAllPaginated({ page: 3, limit: 5, random: false });

      expect(mockSearchAllPaginated).toHaveBeenCalledWith(
        expect.objectContaining({
          pagination: expect.objectContaining({
            offset: 10,
          }),
        }),
      );
    });
  });

  describe("findAll", () => {
    it("deve retornar lista de categorias", async () => {
      mockSearchAll.mockResolvedValue([
        { id_category: 1, name: "Ação", description: "" },
        { id_category: 2, name: "RPG", description: "" },
      ]);

      const result = await service.findAll();

      expect(result).not.toBeNull();
      expect(result).toHaveLength(2);
    });

    it("deve retornar array vazio se não houver categorias", async () => {
      mockSearchAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toHaveLength(0);
    });
  });

  describe("findById", () => {
    it("deve retornar a categoria pelo id", async () => {
      mockSearchById.mockResolvedValue({
        id_category: 1,
        name: "Ação",
        description: "",
      });

      const result = await service.findById(1);

      expect(result).not.toBeNull();
      expect(result!.name).toBe("Ação");
    });

    it("deve retornar null se a categoria não existir", async () => {
      mockSearchById.mockResolvedValue(null);

      const result = await service.findById(999);

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("deve retornar o insertId da nova categoria", async () => {
      mockCreateCategory.mockResolvedValue(5);

      const id = await service.create({
        name: "Terror",
        description: "Jogos de terror",
        image: "terror.png",
      });

      expect(id).toBe(5);
    });

    it("deve chamar INSERT com os valores corretos", async () => {
      mockCreateCategory.mockResolvedValue(1);

      await service.create({
        name: "Aventura",
        description: "Desc",
        image: "img.png",
      });

      expect(mockCreateCategory).toHaveBeenCalledWith({
        name: "Aventura",
        description: "Desc",
        image: "img.png",
      });
    });
  });

  describe("update", () => {
    it("deve retornar true se a categoria foi atualizada", async () => {
      mockUpdateCategory.mockResolvedValue(true);

      const result = await service.update({
        id_category: 1,
        name: "Novo",
        description: "Desc",
        image: "img.png",
      });

      expect(result).toBe(true);
    });

    it("deve retornar false se nenhuma categoria foi encontrada", async () => {
      mockUpdateCategory.mockResolvedValue(false);

      const result = await service.update({
        id_category: 999,
        name: "Novo",
        description: "Desc",
        image: "img.png",
      });

      expect(result).toBe(false);
    });
  });

  describe("delete", () => {
    it("deve retornar true se a categoria foi deletada", async () => {
      mockDeleteCategory.mockResolvedValue(true);

      const result = await service.delete(1);

      expect(result).toBe(true);
    });

    it("deve retornar false se a categoria não existir", async () => {
      mockDeleteCategory.mockResolvedValue(false);

      const result = await service.delete(999);

      expect(result).toBe(false);
    });
  });
});
