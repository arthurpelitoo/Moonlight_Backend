import { jest } from '@jest/globals';
 
jest.unstable_mockModule('../../config/database.js', () => ({
  default: { query: jest.fn() }
}));
 
const { default: pool } = await import('../../config/database.js');
const { OrderService } = await import('../../services/order.Service.js');
 
describe('OrderService - Unitário', () => {
  const service = OrderService.getInstance();
  const mockQuery = pool.query as jest.MockedFunction<() => Promise<any>>;
 
  beforeEach(() => mockQuery.mockReset());
 
  describe('canPurchaseGame', () => {
    it('deve retornar true se o usuário NÃO possui o jogo', async () => {
      mockQuery.mockResolvedValue([[]]); // nenhuma row = não possui
      const result = await service.canPurchaseGame(1, 10);
      expect(result).toBe(true);
    });
 
    it('deve retornar false se o usuário JÁ possui o jogo', async () => {
      mockQuery.mockResolvedValue([[{ 1: 1 }]]); // row encontrada = já possui
      const result = await service.canPurchaseGame(1, 10);
      expect(result).toBe(false);
    });
  });
 
  describe('createOrder', () => {
    it('deve retornar o insertId do novo pedido', async () => {
      mockQuery.mockResolvedValue([{ insertId: 42 }]);
 
      const id = await service.createOrder({
        id_user: 1,
        total: 99.99,
        preference_id: 'pref_abc',
        external_reference: 'ref_abc',
        status: 'pending'
      });
 
      expect(id).toBe(42);
    });
  });
 
  describe('updateOrder', () => {
    it('deve retornar true se o pedido foi atualizado', async () => {
      mockQuery.mockResolvedValue([{ affectedRows: 1 }]);
      const result = await service.updateOrder({
        status: 'approved',
        external_reference: 'ref_abc'
      });
      expect(result).toBe(true);
    });
 
    it('deve retornar false se nenhum pedido foi encontrado', async () => {
      mockQuery.mockResolvedValue([{ affectedRows: 0 }]);
      const result = await service.updateOrder({
        status: 'approved',
        external_reference: 'ref_inexistente'
      });
      expect(result).toBe(false);
    });
  });
 
  describe('findAll', () => {
    it('deve retornar lista de pedidos mapeados', async () => {
      mockQuery.mockResolvedValue([[
        {
          id_order: 1, order_date: new Date(), total: 100,
          status: 'approved', name: 'João', email: 'joao@email.com',
          title: 'Jogo X', image: 'img.png', price: 100
        }
      ]]);
 
      const result = await service.findAll();
      expect(result).not.toBeNull();
      expect(result).toHaveLength(1);
 
      const first = result![0];
      expect(first).toBeDefined();
      expect(first).toHaveProperty('user');
      expect(first?.games).toHaveLength(1);
    });
 
    it('deve agrupar jogos do mesmo pedido corretamente', async () => {
      mockQuery.mockResolvedValue([[
        { id_order: 1, order_date: new Date(), total: 150, status: 'approved', name: 'Ana', email: 'ana@email.com', title: 'Jogo A', image: 'a.png', price: 50 },
        { id_order: 1, order_date: new Date(), total: 150, status: 'approved', name: 'Ana', email: 'ana@email.com', title: 'Jogo B', image: 'b.png', price: 100 }
      ]]);
 
      const result = await service.findAll();
      expect(result).not.toBeNull();
      expect(result).toHaveLength(1);
 
      const first = result![0];
      expect(first).toBeDefined();
      expect(first?.games).toHaveLength(2);
    });
  });
 
  describe('findMyOrders', () => {
    it('deve retornar pedidos do usuário', async () => {
      mockQuery.mockResolvedValue([[
        { id_order: 2, order_date: new Date(), total: 60, status: 'approved', title: 'Jogo C', image: 'c.png', price: 60 }
      ]]);
 
      const result = await service.findMyOrders(1);
      expect(result).not.toBeNull();
      expect(result).toHaveLength(1);

      const first = result![0]!;
      expect(first).toHaveProperty('games');
      expect(first.games[0]!.title).toBe('Jogo C'); // <- ! no games[0] também
    });
  });
 
  describe('findUserLibrary', () => {
    it('deve retornar biblioteca com categorias como array', async () => {
      mockQuery.mockResolvedValue([[
        { id_game: 1, title: 'Jogo D', categories: 'Ação,RPG' }
      ]]);
 
      const result = await service.findUserLibrary(1);
      expect(result).not.toBeNull();
 
      // findUserLibrary - ambos os casos
      const first = result![0]!; // <- duplo ! aqui resolve
      expect(first.categories).toEqual(['Ação', 'RPG']);
    });
 
    it('deve retornar categorias como array vazio se null', async () => {
      mockQuery.mockResolvedValue([[
        { id_game: 2, title: 'Jogo E', categories: null }
      ]]);
 
      const result = await service.findUserLibrary(1);
      expect(result).not.toBeNull();
 
      const first = result![0]!;
      expect(first).toBeDefined();
      expect(first.categories).toEqual([]);
    });
  });
});