import type { IProductForm } from "../models/interfaces/IProductForm";
import type { TProduct } from "../models/types/TProduct";
import type { TProductEndpoint } from "../models/types/TProductEndpoint";

const toNum = (raw: string) => {
  const s = (raw ?? "").trim();
  if (s === "") return 0;
  const normalized =
    s.includes(",")
      ? s.replace(/\./g, "").replace(",", ".")
      : s.replace(/,/g, "");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
};

const toId = (raw: string) => {
  const n = Math.trunc(toNum(raw));
  return n > 0 ? n : 0;
};

export const formToDomain = (f: IProductForm): TProduct => ({
  product_name: f.product_name.trim(),
  sku: f.sku.trim(),
  category_id: toId(f.category_id),
  tax_id: toId(f.tax_id),
  profit_margin: toNum(f.profit_margin),
  unit_price: toNum(f.unit_price),
  stock: Math.trunc(toNum(f.stock)),
  state: f.state ?? "active",
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
