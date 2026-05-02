import type { FilterConfig } from "../../builders/sql/filterConfigType.js";

type GameKeyFilters = "title" | "category" | "price_min" | "price_max" | "launch_date_from" | "launch_date_to" | "active";

export const gameFilterConfig: FilterConfig<GameKeyFilters> = {
  title: { type: 'like', column: 'g.title' },
  category: { type: 'exact', column: 'c.name' },
  price_min: { type: 'greaterThanOrEqual', column: 'g.price' },
  price_max: { type: 'lessThanOrEqual', column: 'g.price' },
  launch_date_from: { type: 'greaterThanOrEqual', column: 'DATE(g.launch_date)' },
  launch_date_to: { type: 'lessThanOrEqual', column: 'DATE(g.launch_date)' },
  active: { type: 'boolean', column: 'g.active' }
};