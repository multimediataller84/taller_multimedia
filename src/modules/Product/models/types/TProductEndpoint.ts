import type { TProductStatus } from "./TProductStatus.js";

export type TProductEndpoint = {
  id: number;
  product_name: string;
  sku: string;
  category_id:  number;
  tax_id: number;
  tax: {description: string, name: string, percentage: number}
  profit_margin: number;
  unit_price: number;
  stock: number;
  state: TProductStatus;
  createdAt: Date;
  updatedAt: Date;
  unit_measure_id?: number;
  unit_measure?: { id: number; symbol: string; description: string };
};