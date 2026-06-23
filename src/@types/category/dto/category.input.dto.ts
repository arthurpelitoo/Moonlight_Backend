import type { PaginatedQuery } from "../../common/pagination.js";

export type CreateCategoryDTO = {
  name: string;
  description: string;
  image?: string | undefined;
};

export type UpdateCategoryDTO = {
  id_category: number;
  name: string;
  description: string;
  image?: string | undefined;
};

export interface GetCategoriesPaginatedDTO extends PaginatedQuery {
  name?: string | undefined
  random?: boolean | undefined;
};