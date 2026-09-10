import type { RoleName } from "../@types/role/role.types.js";

export const requireAdmin: RoleName[] = ['admin'];
export const requireUser: RoleName[] = ['customer', 'admin'];
