/**
 * DTO DE ENTRADA
 */

import type { RowDataPacket } from "mysql2";

export type LoginAuthDTO = {
    email: string;
    password: string;
}

export type RegisterAuthDTO = {
    name: string,
    email: string,
    password: string,
    cpf: string
}

/**
 * DTO DE SAIDA POR QUERY
 */

export type AuthResponseDTO = {
    id_user: number,
    name: string,
    email: string,
    password?: string,
    cpf: string,
    type: 'customer' | 'admin';
    token?: string;
}
