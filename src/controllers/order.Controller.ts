import type { NextFunction, Request, Response } from 'express';
import type { OrderService } from '../services/order.Service.js';
import type { CreateOrderDTO, UpdateOrderDTO } from '../@types/order/dto/order.input.dto.js';
import { AppError } from '../utils/AppError.js';
import { toInt } from '../utils/queryParser.js';


export class OrderController{

  constructor(private orderService: OrderService){} 

      getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
          const orders = await this.orderService.findAll();
          if (!orders) throw new AppError("Pedidos paginados não encontrados", 404, "NOT_FOUND_PAG_ORDERS");

          res.status(200).json(orders);
        } catch (error) {
          next(error);
        }
      };

      getMyOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
          try {
            const id_user = req.user?.id_user;

            const orders = await this.orderService.findMyOrders(id_user!);
            if (!orders) throw new AppError("Pedidos não encontrados", 404, "NOT_FOUND_ORDERS");

            res.status(200).json(orders);
          } catch (error) {
            next(error);
          }
      };

      getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
          try {
            const id_order = toInt(req.params.id, 0);
            const order = await this.orderService.findOrderById(id_order);
            if (!order) throw new AppError("Pedido não encontrado", 404, "NOT_FOUND_ORDER");

            res.status(200).json(order);
          } catch (error) {
            next(error);
          }
      };

      getUserLibrary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
          try {
            const id_user = req.user!.id_user;

            const games = await this.orderService.findUserLibrary(id_user);
            if (!games) throw new AppError("Biblioteca vazia", 404, "EMPTY_LIBRARY");

            res.status(200).json(games);
          } catch (error) {
            next(error);
          }
      };

      canUserPurchase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
          try {
            const id_user = req.user!.id_user;
            const id_game = toInt(req.query.id_game, 0);

            const canPurchase = await this.orderService.canPurchaseGame(id_user, id_game)
            res.status(200).json({canPurchase})
          } catch(error) {
            next(error);
          }
      }

      createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
          try {
              const id_user = req.user!.id_user;
              const dto = req.body as CreateOrderDTO;

              await this.orderService.createOrder({...dto, id_user});

              res.status(201).json({ message: 'Pedido criado com sucesso!'});
          } catch (error) {
            next(error);
          }
      };

      updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
          const dto = req.body as UpdateOrderDTO;

          const updated = await this.orderService.updateOrderStatus(dto);
          if (!updated) throw new AppError("Pedido não encontrado", 404, "ORDER_NOT_FOUND");

          res.status(200).json({ message: 'Status de Pedido atualizado com sucesso!' });
        } catch (error) {
          next(error);
        }
      };
}