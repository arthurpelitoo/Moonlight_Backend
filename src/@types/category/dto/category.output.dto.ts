
export interface CategoryResponseDTO {
  id_category: number;
  name: string;
  description: string;
  image?: string | undefined;
}

export type CategoryResponseCountRowsDTO = {
  total: number;
}
