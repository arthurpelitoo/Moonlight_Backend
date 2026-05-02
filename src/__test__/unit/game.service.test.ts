import { jest } from '@jest/globals';

jest.unstable_mockModule('../../config/database.js', () => ({
  default: { query: jest.fn() }
}));

const { default: pool } = await import('../../config/database.js');
const { GameService } = await import('../../services/game.Service.js');

describe('GameService - Unitário', () => {
  const service = GameService.getInstance();
  const mockQuery = pool.query as jest.MockedFunction<() => Promise<any>>;

  beforeEach(() => mockQuery.mockReset());

  describe('findAll', () => {
    it('deve retornar lista de jogos', async () => {
      mockQuery.mockResolvedValue([[
        { id_game: 1, title: 'Jogo A', price: 50, active: 1 }
      ]]);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(result![0]!.title).toBe('Jogo A');
    });
  });

  describe('findById', () => {
    it('deve retornar jogo com categorias como array', async () => {
      mockQuery.mockResolvedValue([[
        { id_game: 1, title: 'Jogo A', categories: 'Ação,RPG' }
      ]]);
      const result = await service.findById(1);
      expect(result).not.toBeNull();
      expect(result!.categories).toEqual(['Ação', 'RPG']);
    });

    it('deve retornar null se jogo não existir', async () => {
      mockQuery.mockResolvedValue([[]]);
      const result = await service.findById(999);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('deve retornar o id do jogo criado', async () => {
      mockQuery.mockResolvedValue([{ insertId: 7 }]);

      const id = await service.create({
        title: 'Novo Jogo',
        price: 79.99,
        launch_date: '2024-01-01',
        active: true,
        categories: []
      });

      expect(id).toBe(7);
    });

    it('deve inserir categorias se enviadas', async () => {
      mockQuery
        .mockResolvedValueOnce([{ insertId: 8 }]) // INSERT game
        .mockResolvedValueOnce([{ affectedRows: 2 }]); // INSERT game_category

      await service.create({
        title: 'Jogo Com Categorias',
        price: 49.99,
        launch_date: '2024-01-01',
        active: true,
        categories: [1, 2]
      });

      expect(mockQuery).toHaveBeenCalledTimes(2);
    });
  });

  describe('update', () => {
    it('deve retornar true se o jogo foi atualizado', async () => {
      mockQuery.mockResolvedValue([{ affectedRows: 1 }]);

      const result = await service.update({
        title: 'Atualizado',
        price: 30,
        launch_date: '2024-01-01',
        active: true,
        categories: []
      }, 1);

      expect(result).toBe(true);
    });

    it('deve retornar false se jogo não encontrado', async () => {
      mockQuery.mockResolvedValue([{ affectedRows: 0 }]);
      const result = await service.update({ title: 'X', price: 10, launch_date: '2024-01-01', active: false, categories: [] }, 999);
      expect(result).toBe(false);
    });
  });

  describe('delete', () => {
    it('deve retornar true se deletou', async () => {
      mockQuery.mockResolvedValue([{ affectedRows: 1 }]);
      expect(await service.delete(1)).toBe(true);
    });

    it('deve retornar false se não encontrou', async () => {
      mockQuery.mockResolvedValue([{ affectedRows: 0 }]);
      expect(await service.delete(999)).toBe(false);
    });
  });

  describe('findAllPaginated', () => {
    it('deve retornar dados paginados com total e totalPages', async () => {
      mockQuery
        .mockResolvedValueOnce([[{ id_game: 1, title: 'Jogo', categories: 'Ação' }]])
        .mockResolvedValueOnce([[{ total: 1 }]]);

      const result = await service.findAllPaginated({
        page: 1, limit: 8, random: false
      });

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.totalPages).toBe(1);
    });
  });
});