export interface IProduct {
  id?: string;
  name: string;
  category: string;
  cost: number;
  basePrice: number;
  stock: number;
  tax?: number; 
  discount?: number; 
}