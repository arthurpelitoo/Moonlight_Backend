import type { RowDataPacket } from "mysql2";
import type { RoleResponseDTO } from "../role.dto.js";

export type RoleRow = RowDataPacket & RoleResponseDTO;
