import type { PaginatedQuery } from "../../common/pagination.js";

export type CreateGameDTO = {
  title: string;
  description?: string | undefined;
  price: number;
  image?: string | undefined;
  banner_image?: string | undefined;
  link?: string | undefined;
  launch_date: Date;
  active: boolean;
  categories?: number[] | undefined;
};

export type UpdateGameDTO = {
  id_game: number;
  title: string;
  description?: string | undefined;
  price: number;
  image?: string | undefined;
  banner_image?: string | undefined;
  link?: string | undefined;
  launch_date: Date;
  active: boolean;
  categories?: number[] | undefined;
};

/***
 * Data Transfered Object de Query Paginada de Jogos
 * 
 * vai poder usar nas paginas de categoria, em filtro de jogos ou para a pagina principal por exemplo.
 * admin poderá usar a variavel de active pra ver os jogos desativados
 */

export interface GetGamesPaginatedDTO extends PaginatedQuery {
  title?: string | undefined,
  category?: string | undefined,
  launch_date_from?: string | undefined;  // ex: de '2024-01-01'
  launch_date_to?: string | undefined;    // ex: até '2024-12-31'
  price_min?: number | undefined;
  price_max?: number | undefined;
  random?: boolean | undefined;
  random_seed?: number;
  active?: boolean | undefined;
  admin?: boolean | undefined;
} 