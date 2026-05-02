import { jest } from '@jest/globals';

// Mocks antes de qualquer import do serviço
jest.unstable_mockModule('../../services/order.Service.js', () => ({
  OrderService: {
    getInstance: jest.fn().mockReturnValue({
      createOrder: jest.fn(),
      updateOrder: jest.fn()
    })
  }
}));

jest.unstable_mockModule('../../services/purchasedItems.Service.js', () => ({
  PurchasedItemsService: {
    getInstance: jest.fn().mockReturnValue({
      createItems: jest.fn()
    })
  }
}));

jest.unstable_mockModule('mercadopago', () => ({
  MercadoPagoConfig: jest.fn(),
  Preference: jest.fn().mockImplementation(() => ({
    create: jest.fn()
  })),
  Payment: jest.fn().mockImplementation(() => ({
    get: jest.fn()
  }))
}));

const { OrderService } = await import('../../services/order.Service.js');
const { PurchasedItemsService } = await import('../../services/purchasedItems.Service.js');
const { Preference, Payment } = await import('mercadopago');
const { CheckoutService } = await import('../../services/checkout.Service.js');

describe('CheckoutService - Unitário', () => {
  const service = CheckoutService.getInstance();

  const mockOrderService = OrderService.getInstance() as unknown as {
    createOrder: jest.MockedFunction<(...args: any[]) => Promise<any>>;
    updateOrder: jest.MockedFunction<(...args: any[]) => Promise<any>>;
   };

    const mockPurchasedItemsService = PurchasedItemsService.getInstance() as unknown as {
        createItems: jest.MockedFunction<(...args: any[]) => Promise<any>>;
    };

    const mockPreferenceCreate = jest.fn<(...args: any[]) => Promise<any>>();
    const mockPaymentGet = jest.fn<(...args: any[]) => Promise<any>>();

  beforeEach(() => {
    jest.clearAllMocks();
    (Preference as jest.MockedClass<any>).mockImplementation(() => ({ create: mockPreferenceCreate }));
    (Payment as jest.MockedClass<any>).mockImplementation(() => ({ get: mockPaymentGet }));
  });

  describe('createPreference', () => {
    const checkoutPayload = {
      user: { id_user: 1, name: 'João', email: 'joao@email.com' },
      total: 89.98,
      items: [
        { id_game: 1, title: 'Jogo A', price: 59.99 },
        { id_game: 2, title: 'Jogo B', price: 29.99 }
      ]
    };

    it('deve retornar o id da preferência criada', async () => {
      mockPreferenceCreate.mockResolvedValue({ id: 'pref_123' });
      mockOrderService.createOrder.mockResolvedValue(42);
      mockPurchasedItemsService.createItems.mockResolvedValue(undefined);

      const result = await service.createPreference(checkoutPayload);

      expect(result).toBe('pref_123');
    });

    it('deve criar a ordem com os dados corretos', async () => {
      mockPreferenceCreate.mockResolvedValue({ id: 'pref_abc' });
      mockOrderService.createOrder.mockResolvedValue(10);
      mockPurchasedItemsService.createItems.mockResolvedValue(undefined);

      await service.createPreference(checkoutPayload);

      expect(mockOrderService.createOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          id_user: 1,
          total: 89.98,
          preference_id: 'pref_abc',
          status: 'pending'
        })
      );
    });

    it('deve criar os itens comprados com o id_order retornado', async () => {
      mockPreferenceCreate.mockResolvedValue({ id: 'pref_abc' });
      mockOrderService.createOrder.mockResolvedValue(99);
      mockPurchasedItemsService.createItems.mockResolvedValue(undefined);

      await service.createPreference(checkoutPayload);

      expect(mockPurchasedItemsService.createItems).toHaveBeenCalledWith(
        expect.objectContaining({ id_order: 99 })
      );
    });

    it('deve propagar erro se a criação da preferência falhar', async () => {
      mockPreferenceCreate.mockRejectedValue(new Error('MP error'));

      await expect(service.createPreference(checkoutPayload)).rejects.toThrow('MP error');
    });

    it('deve propagar erro se createOrder falhar', async () => {
      mockPreferenceCreate.mockResolvedValue({ id: 'pref_abc' });
      mockOrderService.createOrder.mockRejectedValue(new Error('DB error'));

      await expect(service.createPreference(checkoutPayload)).rejects.toThrow('DB error');
    });
  });

  describe('getPaymentStatus', () => {
    it('deve atualizar o pedido com status approved', async () => {
      mockPaymentGet.mockResolvedValue({ status: 'approved', external_reference: 'order_123' });
      mockOrderService.updateOrder.mockResolvedValue(true);

      await service.getPaymentStatus('pay_001');

      expect(mockOrderService.updateOrder).toHaveBeenCalledWith({
        status: 'approved',
        external_reference: 'order_123'
      });
    });

    it('deve mapear status rejected para canceled', async () => {
      mockPaymentGet.mockResolvedValue({ status: 'rejected', external_reference: 'order_456' });
      mockOrderService.updateOrder.mockResolvedValue(true);

      await service.getPaymentStatus('pay_002');

      expect(mockOrderService.updateOrder).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'canceled' })
      );
    });

    it('deve mapear status cancelled para canceled', async () => {
      mockPaymentGet.mockResolvedValue({ status: 'cancelled', external_reference: 'order_789' });
      mockOrderService.updateOrder.mockResolvedValue(true);

      await service.getPaymentStatus('pay_003');

      expect(mockOrderService.updateOrder).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'canceled' })
      );
    });

    it('deve usar status pending como fallback para status desconhecido', async () => {
      mockPaymentGet.mockResolvedValue({ status: 'in_process', external_reference: 'order_000' });
      mockOrderService.updateOrder.mockResolvedValue(true);

      await service.getPaymentStatus('pay_004');

      expect(mockOrderService.updateOrder).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'pending' })
      );
    });

    it('deve propagar erro se o pagamento não for encontrado', async () => {
      mockPaymentGet.mockRejectedValue(new Error('Payment not found'));

      await expect(service.getPaymentStatus('pay_invalido')).rejects.toThrow('Payment not found');
    });
  });
});