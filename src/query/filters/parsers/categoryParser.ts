import type { Request } from "express";
import type { GetCategoriesPaginatedDTO } from "../../../@types/category/dto/category.input.dto.js";
import { toBoolean, toInt, toString } from "../../../utils/queryParser.js";

export const parseCategoriesQuery = (query: Request['query']): GetCategoriesPaginatedDTO => ({
    page: toInt(query.page, 1),
    limit: toInt(query.limit, 8),
    random: toBoolean(query.random),
    name: toString(query.name)
})