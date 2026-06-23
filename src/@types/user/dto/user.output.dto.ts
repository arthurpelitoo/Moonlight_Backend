/**
 * DTO DE SAIDA POR QUERY
 */

export type UserResponseDTO = {
  id_user: number;
  name: string;
  email: string;
  cpf: string;
  type: 'admin' | 'customer';
};

export type UserResponseCountRowsDTO = {
  total: number;
}
