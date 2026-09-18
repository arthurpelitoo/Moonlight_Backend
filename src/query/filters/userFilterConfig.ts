import type { FilterConfig } from "../../builders/sql/filterConfigType.js";

type UserKeyFilters = "name" | "email" | "cpf" | "role";

export const userFilterConfig: FilterConfig<UserKeyFilters> = {
  name: { type: 'like', column: 'u.name' },
  email: { type: 'like', column: 'u.email' },
  cpf: { type: 'exact', column: 'u.cpf' },
  role: { type: 'exact', column: 'r.name' }
};
