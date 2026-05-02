
export interface OrderQueryPayload {
  id_user: number | undefined;
  total: number;
  preference_id: string | undefined;
  external_reference: string;
  status: 'pending' | 'approved' | 'canceled';
}