export interface IProduct {
  id?: number;
  name: string;
  category: string;
  cost: number;
  basePrice: number;
  stock: number;
  tax?: number; 
  discount?: number; 
}
