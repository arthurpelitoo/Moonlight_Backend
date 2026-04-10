// src/@types/index.ts

declare global {
  namespace Express {
    interface Request {
      user?: { id_user: number };
    }
  }
}


// formato dos dados (o que trafega)
export interface UserDTO {
  id_user?: number;
  name: string;
  email: string;
  password?: string;
  cpf: string;
  type: 'admin' | 'customer';
  created_at?: Date;
}
export type RegisterUserData = Pick<UserDTO, 'name' | 'email' | 'password' | 'cpf'>;

export interface CategoryDTO {
  id_category?: number;
  name: string;
  description: string;
  image?: string;
}

export interface GameDTO {
  id_game?: number;
  title: string;
  description?: string;
  price: number;
  image?: string;
  link?: string;
  launch_date: Date;
  active: boolean;
  stock_available: number;
}

export interface GameCategoryDTO {
  id_game: number;
  id_category: number;
}

export interface GameKeyDTO {
  id_key?: number;
  id_game: number;
  activation_key: string;
  status: 'available' | 'reserved' | 'sold' | 'out_of_stock';
  created_at?: Date;
}

export interface OrderDTO {
  id_order?: number;
  id_user: number;
  order_date: Date;
  total: number;
  preference_id: string;
  external_reference: string;
  status: 'pending' | 'approved' | 'canceled';
}

export interface PurchasedItemDTO {
  id_order: number;
  id_game: number;
  id_key: number;
  price: number;
  created_at?: Date;
}

export interface FavoriteDTO {
  id_user: number;
  id_game: number;
  fav_star: number;
}

export interface PriceAuditDTO {
  id_audiprice?: number;
  id_game: number;
  price_old: number;
  price_new: number;
  altered_at?: Date;
  altered_byUser: string;
}