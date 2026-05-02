/**
 * ROWs respectivos pro que vai sair de select
 */

import type { RowDataPacket } from "mysql2";
import type { CategoryResponseCountRowsDTO, CategoryResponseDTO } from "../dto/category.output.dto.js";

export type CategoryRow = RowDataPacket & CategoryResponseDTO;
export type CategoryCountRows = RowDataPacket & CategoryResponseCountRowsDTO;