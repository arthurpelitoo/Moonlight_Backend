
export type Game = {
  id_game: number;
  title: string;
  description?: string | undefined;
  price: number;
  image?: string | undefined;
  banner_image?: string | undefined;
  link?: string | undefined;
  launch_date: Date;
  active: boolean;
  categories?: string[] | undefined;
};