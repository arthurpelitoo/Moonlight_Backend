/**
 * DTO DE SAIDA POR QUERY
 */

import type { RoleName } from "../../role/role.types.js";

export type UserResponseDTO = {
  id_user: number;
  name: string;
  email: string;
  cpf: string;
  roles: RoleName[]
};

export type UserResponseCountRowsDTO = {
  total: number;
}
