export interface Pizza {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
}

export type PizzaInput = Omit<Pizza, "id">;
