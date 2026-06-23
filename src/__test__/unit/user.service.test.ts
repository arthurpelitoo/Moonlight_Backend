import { jest } from "@jest/globals";
import type { UserRepository } from "../../repositories/UserRepository.js";
import type {
  QueryOptions,
  FilterParams,
} from "../../@types/common/pagination.js";
import type { UserWithoutPassword } from "../../@types/user/repository/user.repository.js";
import type {
  CreateUserDTO,
  UpdateUserDTO,
  UpdateMeDTO,
  GetUsersPaginatedDTO,
} from "../../@types/user/dto/user.input.dto.js";
import type { RegisterAuthDTO } from "../../@types/auth/auth.dto.js";

jest.unstable_mockModule("bcryptjs", () => ({
  default: {
    hash: jest
      .fn<(password: string, rounds: number) => Promise<string>>()
      .mockResolvedValue("hashed_password"),
  },
}));

const { UserService } = await import("../../services/user.Service.js");

const mockUserRepository = {
  findAllPaginated:
    jest.fn<(options: QueryOptions) => Promise<UserWithoutPassword[]>>(),
  count: jest.fn<(params: FilterParams) => Promise<number>>(),
  findAll: jest.fn<() => Promise<UserWithoutPassword[]>>(),
  findById: jest.fn<(id_user: number) => Promise<UserWithoutPassword | null>>(),
  create: jest.fn<(query: CreateUserDTO) => Promise<number>>(),
  update: jest.fn<(query: UpdateUserDTO) => Promise<boolean>>(),
  updateMe: jest.fn<(query: UpdateMeDTO) => Promise<boolean>>(),
  delete: jest.fn<(id_user: number) => Promise<boolean>>(),
  emailAlreadyExists: jest.fn<(email: string) => Promise<boolean>>(),
  emailTakenByAnotherUser:
    jest.fn<(email: string, id_user: number) => Promise<boolean>>(),
} as unknown as UserRepository;

// CPF e senha válidos reutilizados nos testes
const VALID_CPF = "744.846.070-69";
const VALID_PASSWORD = "Abc12345";

describe("UserService - Unitário", () => {
  const service = new UserService(mockUserRepository);

  const mockSearchAllPaginated =
    mockUserRepository.findAllPaginated as jest.MockedFunction<
      (options: QueryOptions) => Promise<UserWithoutPassword[]>
    >;
  const mockCount = mockUserRepository.count as jest.MockedFunction<
    (params: FilterParams) => Promise<number>
  >;
  const mockSearchAll = mockUserRepository.findAll as jest.MockedFunction<
    () => Promise<UserWithoutPassword[]>
  >;
  const mockSearchById = mockUserRepository.findById as jest.MockedFunction<
    (id: number) => Promise<UserWithoutPassword | null>
  >;
  const mockCreate = mockUserRepository.create as jest.MockedFunction<
    (query: CreateUserDTO) => Promise<number>
  >;
  const mockUpdate = mockUserRepository.update as jest.MockedFunction<
    (query: UpdateUserDTO) => Promise<boolean>
  >;
  const mockUpdateMe = mockUserRepository.updateMe as jest.MockedFunction<
    (query: UpdateMeDTO) => Promise<boolean>
  >;
  const mockDelete = mockUserRepository.delete as jest.MockedFunction<
    (id: number) => Promise<boolean>
  >;
  const mockEmailAlreadyExists =
    mockUserRepository.emailAlreadyExists as jest.MockedFunction<
      (email: string) => Promise<boolean>
    >;
  const mockEmailTakenByAnotherUser =
    mockUserRepository.emailTakenByAnotherUser as jest.MockedFunction<
      (email: string, id: number) => Promise<boolean>
    >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findAllPaginated", () => {
    it("deve retornar dados paginados com total e totalPages", async () => {
      mockSearchAllPaginated.mockResolvedValue([
        {
          id_user: 1,
          name: "João",
          email: "joao@email.com",
          cpf: VALID_CPF,
          type: "customer",
        },
      ]);
      mockCount.mockResolvedValue(1);

      const result = await service.findAllPaginated({
        page: 1,
        limit: 5,
      } as GetUsersPaginatedDTO);

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.page).toBe(1);
    });

    it("deve calcular offset corretamente na página 2", async () => {
      mockSearchAllPaginated.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await service.findAllPaginated({
        page: 2,
        limit: 5,
      } as GetUsersPaginatedDTO);

      expect(mockSearchAllPaginated).toHaveBeenCalledWith(
        expect.objectContaining({
          pagination: expect.objectContaining({ offset: 5 }),
        }),
      );
    });
  });

  describe("findAll", () => {
    it("deve retornar lista de usuários", async () => {
      mockSearchAll.mockResolvedValue([
        {
          id_user: 1,
          name: "João",
          email: "joao@email.com",
          cpf: VALID_CPF,
          type: "customer",
        },
      ]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
    });
  });

  describe("findById", () => {
    it("deve retornar usuário pelo id", async () => {
      mockSearchById.mockResolvedValue({
        id_user: 1,
        name: "João",
        email: "joao@email.com",
        cpf: VALID_CPF,
        type: "customer",
      });

      const result = await service.findById(1);

      expect(result).not.toBeNull();
      expect(result!.name).toBe("João");
    });

    it("deve retornar null se usuário não existir", async () => {
      mockSearchById.mockResolvedValue(null);

      const result = await service.findById(999);

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    const createPayload: CreateUserDTO = {
      name: "João",
      email: "joao@email.com",
      password: VALID_PASSWORD,
      cpf: VALID_CPF,
      type: "customer",
    };

    it("deve retornar o id do usuário criado", async () => {
      mockEmailAlreadyExists.mockResolvedValue(false);
      mockCreate.mockResolvedValue(1);

      const id = await service.create(createPayload);

      expect(id).toBe(1);
    });

    it("deve chamar o repositório com cpf limpo e senha hasheada", async () => {
      mockEmailAlreadyExists.mockResolvedValue(false);
      mockCreate.mockResolvedValue(1);

      await service.create(createPayload);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          cpf: "74484607069", // sem pontos e traço
          password: "hashed_password",
        }),
      );
    });

    it("deve lançar erro se email já cadastrado", async () => {
      mockEmailAlreadyExists.mockResolvedValue(true);

      await expect(service.create(createPayload)).rejects.toThrow(
        "Email já cadastrado",
      );
    });

    it("deve lançar erro se campos obrigatórios estiverem faltando", async () => {
      await expect(
        service.create({ ...createPayload, name: "" }),
      ).rejects.toThrow("Todos os campos são obrigatórios");
    });

    it("deve lançar erro se senha fraca", async () => {
      await expect(
        service.create({ ...createPayload, password: "fraca" }),
      ).rejects.toThrow("Senha deve ter pelo menos 8 a 16 caracteres");
    });

    it("deve lançar erro se CPF inválido", async () => {
      await expect(
        service.create({ ...createPayload, cpf: "000.000.000-00" }),
      ).rejects.toThrow("CPF inválido");
    });

    it("deve lançar erro se tipo inválido", async () => {
      await expect(
        service.create({ ...createPayload, type: "superadmin" as any }),
      ).rejects.toThrow("Tipo inválido");
    });
  });

  describe("update", () => {
    const updatePayload: UpdateUserDTO = {
      id_user: 1,
      name: "João",
      email: "joao@email.com",
      password: VALID_PASSWORD,
      cpf: VALID_CPF,
      type: "customer",
    };

    it("deve retornar true se atualizado", async () => {
      mockEmailTakenByAnotherUser.mockResolvedValue(false);
      mockUpdate.mockResolvedValue(true);

      const result = await service.update(updatePayload);

      expect(result).toBe(true);
    });

    it("deve lançar erro se email pertence a outro usuário", async () => {
      mockEmailTakenByAnotherUser.mockResolvedValue(true);

      await expect(service.update(updatePayload)).rejects.toThrow(
        "Email já cadastrado",
      );
    });
  });

  describe("delete", () => {
    it("deve retornar true se deletou", async () => {
      mockDelete.mockResolvedValue(true);
      expect(await service.delete(1)).toBe(true);
    });

    it("deve retornar false se não encontrou", async () => {
      mockDelete.mockResolvedValue(false);
      expect(await service.delete(999)).toBe(false);
    });
  });

  describe("register", () => {
    const registerPayload: RegisterAuthDTO = {
      name: "Maria",
      email: "maria@email.com",
      password: VALID_PASSWORD,
      cpf: VALID_CPF,
    };

    it("deve registrar usuário e retornar id", async () => {
      mockEmailAlreadyExists.mockResolvedValue(false);
      mockCreate.mockResolvedValue(5);

      const id = await service.register(registerPayload);

      expect(id).toBe(5);
    });

    it("deve forçar type=customer independente do payload", async () => {
      mockEmailAlreadyExists.mockResolvedValue(false);
      mockCreate.mockResolvedValue(5);

      await service.register(registerPayload);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ type: "customer" }),
      );
    });

    it("deve lançar erro se email já existe", async () => {
      mockEmailAlreadyExists.mockResolvedValue(true);

      await expect(service.register(registerPayload)).rejects.toThrow(
        "Email já cadastrado",
      );
    });
  });

  describe("updateMe", () => {
    const updateMePayload: UpdateMeDTO = {
      id_user: 1,
      name: "Carlos",
      password: VALID_PASSWORD,
      cpf: VALID_CPF,
    };

    it("deve retornar true se atualizado", async () => {
      mockUpdateMe.mockResolvedValue(true);

      const result = await service.updateMe(updateMePayload);

      expect(result).toBe(true);
    });

    it("deve chamar repositório com cpf limpo e senha hasheada", async () => {
      mockUpdateMe.mockResolvedValue(true);

      await service.updateMe(updateMePayload);

      expect(mockUpdateMe).toHaveBeenCalledWith(
        expect.objectContaining({
          cpf: "74484607069",
          password: "hashed_password",
        }),
      );
    });
  });
});
