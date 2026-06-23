
export type UserWithPassword = {
  id_user: number;
  name: string;
  email: string;
  password: string;
  cpf: string;
  type: 'customer' | 'admin';
};

export type UserWithoutPassword = {
  id_user: number;
  name: string;
  email: string;
  cpf: string;
  type: 'customer' | 'admin';
}