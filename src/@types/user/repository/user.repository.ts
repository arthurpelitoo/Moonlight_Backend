import type { RoleName } from "../../role/role.types.js";

export type UserWithPassword = {
  id_user: number;
  name: string;
  email: string;
  password: string;
  cpf: string;
  roles: RoleName[]
  role_version: number;
};

export type UserWithoutPassword = {
  id_user: number;
  name: string;
  email: string;
  cpf: string;
  roles: RoleName[]
}
