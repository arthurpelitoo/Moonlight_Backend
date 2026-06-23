import type { PaginatedQuery } from "../common/pagination.js";


export interface UserQueryPayload {
  name: string;
  email: string;
  password: string;
  cpf: string;
  type: "admin" | "customer";
}

export interface RegisterUserQueryPayload {
  name: string;
  email: string;
  password: string;
  cpf: string;
}

export interface UpdateMeUserQueryPayload {
  name: string;
  password: string;
  cpf: string;
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