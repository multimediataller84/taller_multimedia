import type { IProductForm } from "../models/interfaces/IProductForm";
import type { TProduct } from "../models/types/TProduct";
import type { TProductEndpoint } from "../models/types/TProductEndpoint";

const toNum = (s: string) =>
  s.trim() === "" ? 0 : Number(s.replace(",", "."));

export const formToDomain = (f: IProductForm): TProduct => ({
  product_name: f.product_name.trim(),
  sku: f.sku.trim(),
  category_id: toNum(f.category_id),
  tax_id: toNum(f.tax_id),
  profit_margin: toNum(f.profit_margin),
  unit_price: toNum(f.unit_price),
  stock: toNum(f.stock),
  state: f.state,
});

export const endpointToForm = (p: TProductEndpoint): IProductForm => ({
  product_name: p.product_name,
  sku: p.sku,
  category_id: String(p.category_id),
  tax_id: String(p.tax_id),
  profit_margin: String(p.profit_margin),
  unit_price: String(p.unit_price),
  stock: String(p.stock),
  state: p.state,
});
