import type { FilterConfig } from "../../builders/sql/filterConfigType.js";

type CategoryKeyFilters = "name";

export const categoryFilterConfig: FilterConfig<CategoryKeyFilters> = {
  name: { type: 'like', column: 'c.name' },
};