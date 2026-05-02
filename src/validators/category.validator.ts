import type { CreateCategoryDTO, UpdateCategoryDTO } from "../@types/category/dto/category.input.dto.js";
import { AppError } from "../utils/AppError.js";


    export const assertRequiredFields = (fields: unknown[]): void => {
        if (fields.some(field => field == null || (typeof field === 'string' && !field.trim()))) 
        throw new AppError("Campos inválidos de Create ou Update de Jogo", 400, "INVALID_FIELDS");
        // o ultimo caso é pra evitar de mandarem ' '.
    }

    export const validateCategory = (dto: CreateCategoryDTO | UpdateCategoryDTO): void => {
        assertRequiredFields([dto.name, dto.description]);
    }
