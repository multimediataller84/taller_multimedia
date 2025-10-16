import { TProductEndpoint } from "../../../Product/models/types/TProductEndpoint";

export type TInvoiceItem = {
  product_id: number;
  product_name: string;
  sku: string;
  tax_id: number; // usado como "Impuesto ID" en la tabla
  tax_percentage?: number;
  unit_price: number;
  qty: number;
};

export const createItemFromProduct = (p: TProductEndpoint): TInvoiceItem => ({
  product_id: p.id,
  product_name: p.product_name,
  sku: p.sku,
  tax_id: p.tax_id,
  tax_percentage: p.tax?.percentage,
  unit_price: Number(p.unit_price),
  qty: 1,
});
