import type { Request } from "express";
import { toBoolean, toFloat, toInt, toString } from "../../utils/queryParser.js";
import type { GetGamesPaginatedDTO } from "../../@types/game/dto/game.input.dto.js";

export const parseGameQuery = (query: Request['query']): GetGamesPaginatedDTO => ({
    page: toInt(query.page, 1),
    limit: toInt(query.limit, 8),
    random: toBoolean(query.random),
    title: toString(query.title),
    category: toString(query.category),
    launch_date_from: toString(query.launch_date_from),
    launch_date_to: toString(query.launch_date_to),
    price_min: toFloat(query.price_min),
    price_max: toFloat(query.price_max)
})