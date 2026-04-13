// src/@types/index.ts

import type { CategoryEntity } from "../models/category.ts";
import type { GameEntity } from "../models/game.ts";
import type { UserEntity } from "../models/user.ts";

declare global {
  namespace Express {
    interface Request {
      user?: { id_user: number, type: "admin" | "customer" };
    }
  }
}


// formato dos dados (o que trafega)
export interface UserDTO {
  id_user?: number;
  name: string;
  email: string;
  password?: string;
  cpf: string;
  type: 'admin' | 'customer';
  created_at?: Date;
}

export interface CategoryDTO {
  id_category?: number;
  name: string;
  description: string;
  image?: string | undefined;
}

export interface GameDTO {
  id_game?: number;
  title: string;
  description?: string | undefined;
  price: number;
  image?: string | undefined;
  banner_image?: string | undefined;
  link?: string | undefined;
  launch_date: Date;
  active: boolean;
  categories?: string[] | undefined;
}


export interface OrderDTO {
  id_order?: number;
  id_user: number;
  order_date: Date;
  total: number;
  preference_id: string;
  external_reference: string;
  status: 'pending' | 'approved' | 'canceled';
}

export interface PurchasedItemDTO {
  id_order: number;
  id_game: number;
  id_key: number;
  price: number;
  created_at?: Date;
}

export interface FavoriteDTO {
  id_user: number;
  id_game: number;
  fav_star: number;
}

export interface PriceAuditDTO {
  id_audiprice?: number;
  id_game: number;
  price_old: number;
  price_new: number;
  altered_at?: Date;
  altered_byUser: string;
}

/**
 * O que vai chegar de dados em create ou update do front com base no Entity de cada Model.
 */

export type UserQueryPayload = Omit<UserEntity, 'id_user'>
export type RegisterUserQueryPayload = Pick<UserDTO, 'name' | 'email' | 'password' | 'cpf'>;
export type UpdateMeUserQueryPayload = Pick<UserEntity, 'name' | 'password' | 'cpf'>;

export type CategoryQueryPayload = Omit<CategoryEntity, 'id_category'>

export interface GameQueryPayload extends Omit<GameEntity, 'id_game'> {
  categories?: number[];
}

/**
 * Paginação
 */

interface PaginatedQuery {
  page: number,
  limit: number
}

/**
 *   data: os itens da página atual |
 *   total: total de jogos no banco (com os filtros aplicados) |
 *   page: página que foi solicitada |
 *   totalPages: quantas páginas existem no total calculando com base no filtro ou não
 */
export interface PaginatedResponse<RowData> {
    data: RowData[];
    total: number;
    page: number;
    totalPages: number;
}

/***
 * Payload de Query Paginada de Usuario
 * 
 * vai usar só nas tabelas de admin
 */

export interface UserPaginatedQueryPayload extends PaginatedQuery{
  name?: string | undefined,
  email?: string | undefined,
  cpf?: string | undefined,
  type?: string | undefined
}

/***
 * Payload de Query Paginada de Jogos
 * 
 * vai poder usar nas paginas de categoria, em filtro de jogos ou para a pagina principal por exemplo.
 * admin poderá usar a variavel de active pra ver os jogos desativados
 */
export interface GamePaginatedQueryPayload extends PaginatedQuery{
  title?: string | undefined,
  category?: string | undefined,
  launch_date_from?: string | undefined;  // ex: de '2024-01-01'
  launch_date_to?: string | undefined;    // ex: até '2024-12-31'
  price_min?: number | undefined;
  price_max?: number | undefined;
  random?: boolean;
  active?: boolean | undefined;
  admin?: boolean;
}

/***
 * Payload de Query Paginada de Categoria
 * 
 * vai usar nas tabelas de admin
 */

export interface CategoryPaginatedQueryPayload extends PaginatedQuery{
  name?: string | undefined
  random?: boolean
}
