//ORDEM: dc //src/@types/index.ts
export interface IUser {
  id_user?: number;
  name_user: string;
  email_user: string;
  password_user: string; //back-end, trataremos o hash
  cpf_user: string;
  level_access: 'admin' | 'client';
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id_user: number;
      };
    }
  }
}

export interface IProduct {
  id_product?: number;
  name_product: string;
  desc_product: string;
  price_product: number;
  quantity_iventory: number;
  id_category: number;
}
