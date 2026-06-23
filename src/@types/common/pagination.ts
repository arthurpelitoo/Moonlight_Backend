/**
 * Paginação
 */

export interface PaginatedQuery {
  page: number,
  limit: number
}

// repository filter params

export interface FilterParams {
  where: string,
  dbParams: any[],
  order?: string,
}

// repository params

export interface QueryOptions {
  filters: FilterParams;
  pagination: {
    limit: number;
    offset: number;
  }
  
};

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
