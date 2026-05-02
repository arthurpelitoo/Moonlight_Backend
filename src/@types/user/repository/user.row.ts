/**
 * ROWs respectivos pro que vai sair de select
 */

import type { RowDataPacket } from "mysql2";
import type { UserResponseCountRowsDTO, UserResponseDTO } from "../dto/user.output.dto.js";

export type UserRow = RowDataPacket & UserResponseDTO;

export type UserRowWithPassword = RowDataPacket &{
    id_user: number,
    name: string,
    email: string,
    password: string,
    cpf: string,
    type: 'customer' | 'admin';
};

export type UserCountRows = RowDataPacket & UserResponseCountRowsDTO;