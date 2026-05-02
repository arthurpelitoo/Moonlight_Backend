import type { CreateGameDTO, UpdateGameDTO } from "../@types/game/dto/game.input.dto.js";
import { AppError } from "../utils/AppError.js";
import { isPriceValid } from "../utils/Validators/isPriceValid.js";


    export const assertRequiredFields = (fields: unknown[]): void => {
        if (fields.some(field => field == null || (typeof field === 'string' && !field.trim()))) 
        throw new AppError("Campos inválidos de Create ou Update de Jogo", 400, "INVALID_FIELDS");
        // o ultimo caso é pra evitar de mandarem ' '.
    }

    const assertPrice = (price: number): void => {
        if(!isPriceValid(price)) throw new AppError("O preço do jogo é inválido", 400, "INVALID_GAME_PRICE");
    }

    export const validateGame = (dto: CreateGameDTO | UpdateGameDTO): void => {
        assertRequiredFields([dto.title, dto.price, dto.launch_date, dto.active]);
        assertPrice(dto.price);
    }
