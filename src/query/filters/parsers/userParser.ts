import type { Request } from "express";
import type { GetUsersPaginatedDTO } from "../../../@types/user/dto/user.input.dto.js";
import { toInt, toString } from "../../../utils/queryParser.js";

export const parseUserQuery = (query: Request['query']): GetUsersPaginatedDTO => ({
    page: toInt(query.page, 1),
    limit: toInt(query.limit, 10),
    name: toString(query.name),
    email: toString(query.email),
    cpf: toString(query.cpf),
    type: toString(query.type)
})