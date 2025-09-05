export type TProduct = {
  id?: number;
  name: string;
  category: string;
  cost: number;
  basePrice: number;
  stock: number;
  finalPrice: number; // calculado = basePrice + impuesto - descuento
};
