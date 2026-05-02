import { jest } from '@jest/globals';
import type { UserEntity } from '../../models/user.js';

jest.unstable_mockModule('../../config/database.js', () => ({
  default: { query: jest.fn() }
}));

jest.unstable_mockModule('bcryptjs', () => ({
  default: { compare: jest.fn() }
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: { sign: jest.fn() }
}));

const { default: pool } = await import('../../config/database.js');
const { default: bcrypt } = await import('bcryptjs');
const { default: jwt } = await import('jsonwebtoken');
const { AuthService } = await import('../../services/auth.Service.js');

describe('AuthService - Unitário', () => {
  const service = AuthService.getInstance();
  const mockQuery = pool.query as jest.MockedFunction<(...args: any[]) => Promise<any>>;
  const mockCompare = bcrypt.compare as jest.MockedFunction<(...args: any[]) => Promise<any>>;
  const mockSign = jwt.sign as jest.MockedFunction<(...args: any[]) => any>;

  beforeEach(() => {
    mockQuery.mockReset();
    mockCompare.mockReset();
    mockSign.mockReset();
  });

  describe('findByEmail', () => {
    it('deve retornar o usuário se o email existir', async () => {
      mockQuery.mockResolvedValue([[
        { id_user: 1, name: 'João', email: 'joao@email.com', password: 'Qwert678', type: 'customer', cpf: '000.000.000-00' }
      ]]);

      const result = await service.findByEmail('joao@email.com');

      expect(result).not.toBeNull();
      expect(result!.email).toBe('joao@email.com');
    });

    it('deve retornar null se o email não existir', async () => {
      mockQuery.mockResolvedValue([[]]);

      const result = await service.findByEmail('naoexiste@email.com');

      expect(result).toBeNull();
    });

    it('deve buscar pelo email correto na query', async () => {
      mockQuery.mockResolvedValue([[]]);

      await service.findByEmail('teste@email.com');

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE email = ?'),
        ['teste@email.com']
      );
    });
  });

  describe('verifyPassword', () => {
    it('deve retornar true se a senha estiver correta', async () => {
      mockCompare.mockResolvedValue(true);

      const result = await service.verifyPassword('senha123', 'hash_da_senha');

      expect(result).toBe(true);
      expect(mockCompare).toHaveBeenCalledWith('senha123', 'hash_da_senha');
    });

    it('deve retornar false se a senha estiver incorreta', async () => {
      mockCompare.mockResolvedValue(false);

      const result = await service.verifyPassword('senhaErrada', 'hash_da_senha');

      expect(result).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('deve chamar jwt.sign com o payload e secret corretos', () => {
      mockSign.mockReturnValue('token_gerado');

      const user: UserEntity = { id_user: 1, type: 'customer' as const, name: 'João', email: 'joao@email.com', password: 'Qwert678', cpf: '000' };
      const token = service.generateToken('meu_secret', user);

      expect(mockSign).toHaveBeenCalledWith(
        { id_user: 1, type: 'customer' },
        'meu_secret',
        { expiresIn: '8h' }
      );
      expect(token).toBe('token_gerado');
    });

    it('deve propagar erro se jwt.sign lançar exceção', () => {
      mockSign.mockImplementation(() => { throw new Error('JWT error'); });

      const user: UserEntity = { id_user: 1, type: 'customer', name: 'João', email: 'joao@email.com', password: 'Qwert678', cpf: '000' };

      expect(() => service.generateToken('secret', user)).toThrow('JWT error');
    });
  });
});