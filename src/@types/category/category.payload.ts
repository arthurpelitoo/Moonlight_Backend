import type { PaginatedQuery } from "../common/pagination.js";

export interface CategoryQueryPayload {
  name: string;
  description: string;
  id_category?: number | undefined;
  image?: string | undefined;
}

/***
 * Payload de Query Paginada de Categoria
 * 
 * vai usar nas tabelas de admin
 */

// export interface CategoryPaginatedQueryPayload extends PaginatedQuery{
//   name?: string | undefined
//   random?: boolean
// }
