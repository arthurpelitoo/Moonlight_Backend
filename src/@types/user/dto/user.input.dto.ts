/**
 * DTO DE ENTRADA
 */

import type { PaginatedQuery } from "../../common/pagination.js";
import type { RoleName } from "../../role/role.types.js";

export type CreateUserDTO = {
  name: string;
  email: string;
  password: string;
  cpf: string;
  id_roles: number[];
};

export type UpdateUserDTO = {
  id_user: number
  name: string;
  email: string;
  password: string;
  cpf: string;
  id_roles: number[];
};

export type UpdateMeDTO = {
  id_user: number
  name: string;
  password: string;
  cpf: string;
};



export interface GetUsersPaginatedDTO extends PaginatedQuery {
  name?: string | undefined
  email?: string | undefined;
  cpf?: string | undefined;
  role?: string | undefined;
};
