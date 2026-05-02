import { jest } from '@jest/globals';

jest.unstable_mockModule('../../config/database.js', () => ({
  default: { query: jest.fn() }
}));

const { default: pool } = await import('../../config/database.js');
const { CategoryService } = await import('../../services/category.Service.js');

describe('CategoryService - Unitário', () => {
  const service = CategoryService.getInstance();
  const mockQuery = pool.query as jest.MockedFunction<(...args: any[]) => Promise<any>>;

  beforeEach(() => mockQuery.mockReset());

  describe('findAllPaginated', () => {
    it('deve retornar dados paginados com total e totalPages', async () => {
      mockQuery
        .mockResolvedValueOnce([[{ id_category: 1, name: 'Ação' }]])
        .mockResolvedValueOnce([[{ total: 1 }]]);

      const result = await service.findAllPaginated({ page: 1, limit: 10, random: false });

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('deve chamar query duas vezes (dados + contagem)', async () => {
      mockQuery
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([[{ total: 0 }]]);

      await service.findAllPaginated({ page: 1, limit: 10, random: false });

      expect(mockQuery).toHaveBeenCalledTimes(2);
    });

    it('deve aplicar filtro de nome quando fornecido', async () => {
      mockQuery
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([[{ total: 0 }]]);

      await service.findAllPaginated({ page: 1, limit: 10, random: false, name: 'RPG' });

      const firstCall = mockQuery.mock.calls[0] as any[];
      expect(firstCall[1]).toContain('%RPG%');
    });

    it('deve usar ORDER BY RAND() quando random = true', async () => {
      mockQuery
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([[{ total: 0 }]]);

      await service.findAllPaginated({ page: 1, limit: 10, random: true });

      const firstCall = mockQuery.mock.calls[0] as any[];
      expect(firstCall[0]).toContain('RAND()');
    });

    it('deve calcular offset corretamente na página 3', async () => {
      mockQuery
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([[{ total: 0 }]]);

      await service.findAllPaginated({ page: 3, limit: 5, random: false });

      const firstCall = mockQuery.mock.calls[0] as any[];
      const params = firstCall[1] as any[];
      expect(params).toContain(10); // offset = (3-1) * 5
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de categorias', async () => {
      mockQuery.mockResolvedValue([[
        { id_category: 1, name: 'Ação' },
        { id_category: 2, name: 'RPG' }
      ]]);

      const result = await service.findAll();

      expect(result).not.toBeNull();
      expect(result).toHaveLength(2);
    });

    it('deve retornar array vazio se não houver categorias', async () => {
      mockQuery.mockResolvedValue([[]]);

      const result = await service.findAll();

      expect(result).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('deve retornar a categoria pelo id', async () => {
      mockQuery.mockResolvedValue([[{ id_category: 1, name: 'Ação' }]]);

      const result = await service.findById(1);

      expect(result).not.toBeNull();
      expect(result!.name).toBe('Ação');
    });

    it('deve retornar null se a categoria não existir', async () => {
      mockQuery.mockResolvedValue([[]]);

      const result = await service.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('deve retornar o insertId da nova categoria', async () => {
      mockQuery.mockResolvedValue([{ insertId: 5 }]);

      const id = await service.create({ name: 'Terror', description: 'Jogos de terror', image: 'terror.png' });

      expect(id).toBe(5);
    });

    it('deve chamar INSERT com os valores corretos', async () => {
      mockQuery.mockResolvedValue([{ insertId: 1 }]);

      await service.create({ name: 'Aventura', description: 'Desc', image: 'img.png' });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO category'),
        ['Aventura', 'Desc', 'img.png']
      );
    });
  });

  describe('update', () => {
    it('deve retornar true se a categoria foi atualizada', async () => {
      mockQuery.mockResolvedValue([{ affectedRows: 1 }]);

      const result = await service.update({ name: 'Novo', description: 'Desc', image: 'img.png' }, 1);

      expect(result).toBe(true);
    });

    it('deve retornar false se nenhuma categoria foi encontrada', async () => {
      mockQuery.mockResolvedValue([{ affectedRows: 0 }]);

      const result = await service.update({ name: 'Novo', description: 'Desc', image: 'img.png' }, 999);

      expect(result).toBe(false);
    });
  });

  describe('delete', () => {
    it('deve retornar true se a categoria foi deletada', async () => {
      mockQuery.mockResolvedValue([{ affectedRows: 1 }]);

      const result = await service.delete(1);

      expect(result).toBe(true);
    });

    it('deve retornar false se a categoria não existir', async () => {
      mockQuery.mockResolvedValue([{ affectedRows: 0 }]);

      const result = await service.delete(999);

      expect(result).toBe(false);
    });
  });
});