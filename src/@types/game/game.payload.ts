
export interface GameQueryPayload {
  title: string;
  description?: string;
  price: number;
  image?: string;
  banner_image?: string;
  link?: string;
  launch_date: string;
  active: boolean;
  categories?: number[];
}
