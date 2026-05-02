import { jest } from '@jest/globals';

// Mock do pool ANTES de importar o service
jest.unstable_mockModule('../../config/database.js', () => ({
  default: { query: jest.fn() }
}));

const { default: pool } = await import('../../config/database.js');
const { PurchasedItemsService } = await import('../../services/purchasedItems.Service.js');

describe('PurchasedItemsService - Unitário', () => {
  const service = PurchasedItemsService.getInstance();
  const mockQuery = pool.query as jest.MockedFunction<() => Promise<any>>;

  beforeEach(() => {
    mockQuery.mockReset();
  });

  it('deve inserir cada item da lista no banco', async () => {
    mockQuery.mockResolvedValue([{ insertId: 1, affectedRows: 1 }]);

    await service.createItems({
      id_order: 10,
      items: [
        { title: "carlos", id_game: 1, price: 59.99 },
        { title: "carlos", id_game: 2, price: 29.99 }
      ]
    });

    expect(mockQuery).toHaveBeenCalledTimes(2);

    expect(mockQuery).toHaveBeenNthCalledWith(
      1,
      'INSERT INTO purchased_items (id_order, id_game, price) VALUES (?, ?, ?)',
      [10, 1, 59.99]
    );
    expect(mockQuery).toHaveBeenNthCalledWith(
      2,
      'INSERT INTO purchased_items (id_order, id_game, price) VALUES (?, ?, ?)',
      [10, 2, 29.99]
    );
  });

  it('deve não chamar query se a lista de items estiver vazia', async () => {
    await service.createItems({ id_order: 10, items: [] });
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it('deve converter price para number antes de inserir', async () => {
    mockQuery.mockResolvedValue([{ insertId: 1 }]);

    await service.createItems({
      id_order: 5,
      items: [{ title: "carlos", id_game: 3, price: '49.99' as any }]
    });

    expect(mockQuery).toHaveBeenCalledWith(
      expect.any(String),
      [5, 3, 49.99] // number, não string
    );
  });

  it('deve propagar erro se o banco falhar', async () => {
    mockQuery.mockRejectedValue(new Error('DB error'));

    await expect(
      service.createItems({ id_order: 1, items: [{ title: "carlos", id_game: 1, price: 10 }] })
    ).rejects.toThrow('DB error');
  });
});