import type { TProductStatus } from "./TProductStatus";

export type TProduct = {
  product_name: string;
  sku: string;
  category_id:  number;
  tax_id: number;
  profit_margin: number;
  unit_price: number;
  stock: number;
  state: TProductStatus;
};
