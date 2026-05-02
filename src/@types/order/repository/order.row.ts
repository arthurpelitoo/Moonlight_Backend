/**
 * ROWs respectivos pro que vai sair de select
 */

import type { RowDataPacket } from "mysql2";
import type { OrderResponseMyOrdersDTO } from "../dto/order.output.dto.js";

export type OrderRow = RowDataPacket & {
  id_order: number;
  order_date: Date;
  total: number;
  status: 'pending' | 'approved' | 'canceled';
  name: string;
  email: string;
  title: string;
  image: string;
  price: number;
};

export type MyOrderRows = RowDataPacket & OrderResponseMyOrdersDTO;

export type LibraryOrderRows = RowDataPacket & {
  title: string,
  price: number,
  launch_date: Date,
  active: boolean,
  id_game: number,
  description: string | undefined,
  image: string | undefined,
  banner_image: string | undefined,
  link: string | undefined,
  categories: string | null;
};