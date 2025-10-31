import { TProductEndpoint } from "../../../Product/models/types/TProductEndpoint";

export type TInvoiceItem = {
  product_id: number;
  product_name: string;
  sku: string;
  tax_id: number;
  tax_percentage: number;
  unit_price: number;
  profit_margin: number;
  qty: number;
  unit_measure_id?: number;
  unit_measure_symbol?: string;
  unit_measure_description?: string;
  grams?: number;
};

export const createItemFromProduct = (p: TProductEndpoint): TInvoiceItem => ({
  product_id: p.id,
  product_name: p.product_name,
  sku: p.sku,
  tax_id: p.tax_id,
  tax_percentage: Number(p.tax?.percentage) ?? 0,
  unit_price: Number(p.unit_price),
  profit_margin: Number(p.profit_margin),
  qty: 1,
  unit_measure_id: p.unit_measure_id,
  unit_measure_symbol: p.unit_measure?.symbol,
  unit_measure_description: p.unit_measure?.description,
  grams: 0,
});
