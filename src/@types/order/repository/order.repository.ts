export type Order = {
  id_order: number;
  order_date: Date;
  total: number;
  status: 'pending' | 'approved' | 'canceled';
  user: {
    name: string,
    email: string
  },
  games: {
    title: string,
    image: string,
    price: number
  }[]
};

export type OrderWithoutUser = {
  id_order: number;
  order_date: Date;
  total: number;
  status: 'pending' | 'approved' | 'canceled';
  games: {
    title: string,
    image: string,
    price: number
  }[]
};

export type ApprovedOrdersOfUser = {
  price: number,
  launch_date: Date,
  active: boolean,
  id_game?: number,
  description?: string | undefined,
  image?: string | undefined,
  banner_image?: string | undefined,
  link?: string | undefined,
  categories: string[];
};
