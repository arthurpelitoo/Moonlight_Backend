import { jest } from "@jest/globals";
import type { UserRepository } from "../../repositories/UserRepository.js";
import type { UserWithPassword } from "../../@types/user/repository/user.repository.js";
import type { AuthResponseDTO } from "../../@types/auth/auth.dto.js";

jest.unstable_mockModule("bcryptjs", () => ({
  default: { compare: jest.fn() },
}));
jest.unstable_mockModule("jsonwebtoken", () => ({
  default: { sign: jest.fn() },
}));
// intercepta qualquer import de bcryptjs/jsonwebtoken no arquivo inteiro
// e substitui por um objeto fake com funções monitoradas pelo Jest.
//
// o default: é necessário porque esses módulos exportam com export default.
//
// usamos unstable_mockModule (não jest.mock) porque o projeto usa ESM.

const { default: bcrypt } = await import("bcryptjs");
const { default: jwt } = await import("jsonwebtoken");
// importa os módulos DEPOIS de registrar os mocks acima.
// se importasse antes, o Jest não conseguiria interceptar.
// { default: bcrypt } é destructuring — pega a propriedade default e renomeia pra bcrypt.
//
// como queremos testar a service, mockamos as funções que nossos métodos usam por baixo.
// (verifyPassword usa bcrypt.compare, generateToken usa jwt.sign).

const { AuthService } = await import("../../services/auth.Service.js");
// importa a service também de forma dinâmica pelo mesmo motivo —
// garante que quando ela for carregada, os mocks de bcrypt e jwt já estão no lugar.

describe("AuthService - Unitário", () => {
  const mockUserRepository = {
    findByEmail: jest.fn<(email: string) => Promise<AuthResponseDTO | null>>(),
  } as unknown as UserRepository;
  // cria um objeto fake que imita o UserRepository.
  // jest.fn<() => Promise<AuthResponseDTO | null>>() cria uma função monitorada
  // já tipada com o retorno correto — assim o mockResolvedValue aceita AuthResponseDTO | null.
  // as unknown as UserRepository é um double cast:
  //   1. as unknown — desliga a checagem do TS (o objeto não implementa tudo do UserRepository)
  //   2. as UserRepository — convence o TS que é do tipo certo pra passar no construtor

  const service = new AuthService(mockUserRepository);
  // instancia o AuthService passando o repositório fake.
  // é a injeção de dependência funcionando a favor dos testes —
  // em vez do repositório real que faria SQL, passamos o mock.

  const mockEmailSearch = mockUserRepository.findByEmail as jest.MockedFunction<
    (email: string) => Promise<AuthResponseDTO | null>
  >;
  // pega o findByEmail fake e o tipa como MockedFunction com a assinatura correta.
  // MockedFunction<T> preserva os tipos dos argumentos e do retorno da função —
  // o TS sabe que recebe string e retorna Promise<AuthResponseDTO | null>.
  // isso libera os métodos do Jest (mockResolvedValue, mockReset, toHaveBeenCalledWith)
  // sem precisar de cast adicional na hora de usar.

  const mockPasswordCompare = bcrypt.compare as jest.MockedFunction<
    (...args: any[]) => Promise<any>
  >;
  // pega o bcrypt.compare (que foi substituído pelo mock acima) e o tipa como MockedFunction.
  // usamos (...args: any[]) => Promise<any> genérico porque não queremos copiar
  // a assinatura exata do bcrypt — qualquer argumento e qualquer retorno async serve.

  const mockAssignatureSign = jwt.sign as jest.MockedFunction<
    (...args: any[]) => any
  >;
  // mesmo esquema pro jwt.sign.
  // sem Promise<any> porque jwt.sign é síncrono (retorna string, não Promise).

  beforeEach(() => {
    mockEmailSearch.mockReset();
    mockPasswordCompare.mockReset();
    mockAssignatureSign.mockReset();
  });
  // roda antes de CADA it().
  // mockReset() limpa o histórico de chamadas e o valor de retorno configurado.
  // garante que o mock de um teste não vaza pro próximo —
  // sem isso, se o teste A configurar mockResolvedValue(usuario),
  // o teste B ainda teria esse valor se não configurasse o seu próprio.

  describe("findByEmail", () => {
    it("deve retornar o usuário se o email existir", async () => {
      const mockUser = {
        id_user: 1,
        name: "João",
        email: "joao@email.com",
        password: "Qwert678",
        type: "customer",
        cpf: "000.000.000-00",
      } as AuthResponseDTO; // objeto fake representando um usuário que o mock vai retornar.

      mockEmailSearch.mockResolvedValue(mockUser);
      // configura o mock: "quando findByEmail for chamado, finge que fez await e retornou mockUser".
      // mockResolvedValue é para funções assíncronas (equivale a async () => mockUser).
      // para funções síncronas seria mockReturnValue.

      const user = await service.findByEmail("joao@email.com");
      // chama o método real da service — ele vai chamar o repositório fake por baixo.

      expect(user).not.toBeNull();
      // tenho a expectativa de que o retorno não é nulo

      expect(user!.email).toBe("joao@email.com");
      // expectativa: o email do retorno é exatamente "joao@email.com".
      // o ! é non-null assertion do TS — você dizendo que sabe que não é null aqui.
    });

    it("deve retornar null se o email não existir", async () => {
      mockEmailSearch.mockResolvedValue(null);
      // configura o mock pra simular email não encontrado no banco.

      const user = await service.findByEmail("naoexiste@email.com");

      expect(user).toBeNull();
      // tenho a expectativa de que o retorno é nulo quando o email não existe.
    });

    it("deve buscar pelo email correto na query", async () => {
      mockEmailSearch.mockResolvedValue(null);
      // null aqui porque o que importa nesse teste não é o retorno,
      // mas sim verificar se o repositório foi chamado com o argumento certo.

      await service.findByEmail("teste@email.com");

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        "teste@email.com",
      );
      // toHaveBeenCalledWith verifica se a função foi chamada com esse argumento exato.
      // testa o "contrato" entre service e repository —
      // garante que a service repassa o email corretamente, sem modificar.
    });
  });

  describe("verifyPassword", () => {
    it("deve retornar true se a senha estiver correta", async () => {
      mockPasswordCompare.mockResolvedValue(true);
      // configura o bcrypt.compare fake pra retornar true (senha correta).

      const result = await service.verifyPassword("senha123", "hash_da_senha");
      // chama o método real — por baixo ele chama bcrypt.compare que está mockado.

      expect(result).toBe(true);
      // tenho a expectativa de que a senha seja verdadeira.
      expect(mockPasswordCompare).toHaveBeenCalledWith(
        "senha123",
        "hash_da_senha",
      );
      // expectativa: o bcrypt.compare foi chamado com a senha e o hash corretos.
      // garante que a service repassa os argumentos certos pra lib.
    });

    it("deve retornar false se a senha estiver incorreta", async () => {
      mockPasswordCompare.mockResolvedValue(false);
      // configura o bcrypt.compare fake pra retornar false (senha incorreta).

      const result = await service.verifyPassword(
        "senhaErrada",
        "hash_da_senha",
      );

      expect(result).toBe(false);
      // a expectativa é que retorne false quando a senha não bate.
    });
  });

  describe("generateToken", () => {
    it("deve chamar jwt.sign com o payload e secret corretos", () => {
      mockAssignatureSign.mockReturnValue("token_gerado");
      //mockReturnValue porque jwt.sign é sincrono.
      // configura o fake pra retornar essa string.

      const user: UserWithPassword = {
        id_user: 1,
        type: "customer",
        name: "João",
        email: "joao@email.com",
        password: "Qwert678",
        cpf: "000",
      };
      const token = service.generateToken("meu_secret", user);
      // chama o método real — por baixo ele chama o jwt.sign fake.

      expect(mockAssignatureSign).toHaveBeenCalledWith(
        { id_user: 1, type: "customer" },
        "meu_secret",
        { expiresIn: "8h" },
      );
      // expectativa: jwt.sign foi chamado com o payload correto (só id e type, sem dados sensíveis),
      // com o secret e com as opções de expiração.
      // esse teste garante que a service não vaza dados desnecessários no token.

      expect(token).toBe("token_gerado");
      // a expectativa é de que o retorno do método seja exatamente o que o jwt.sign retornou.
    });

    it("deve propagar erro se jwt.sign lançar exceção", () => {
      mockAssignatureSign.mockImplementation(() => {
        throw new Error("JWT error");
      });
      // mockImplementation substitui a implementação da função por completo.
      // aqui simulamos jwt.sign quebrando — queremos garantir que
      // a service não engole o erro silenciosamente.

      const user: UserWithPassword = {
        id_user: 1,
        type: "customer",
        name: "João",
        email: "joao@email.com",
        password: "Qwert678",
        cpf: "000",
      };

      expect(() => service.generateToken("secret", user)).toThrow("JWT error");
      // expect recebe uma arrow function aqui (não o resultado direto) —
      // isso é necessário porque queremos capturar a exceção que ela lança,
      // não deixar o erro estourar e quebrar o teste.
      // toThrow verifica que a exceção foi lançada com a mensagem correta.
    });
  });
});
