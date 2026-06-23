/**
 * DTO DE ENTRADA
 */

export type CreateOrderDTO = {
  id_user: number,
  total: number,
  preference_id: string;
  external_reference: string,
  status: 'pending' | 'approved' | 'canceled'
}


export type UpdateOrderDTO = {
  status: string;
  external_reference: string;
}