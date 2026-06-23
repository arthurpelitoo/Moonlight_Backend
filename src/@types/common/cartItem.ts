// o que vai vir do carrinho do front
export interface CartItem {
  id_game: number;
  title: string;
  price: number;
  image?: string;
  categories?: string[];
}
