import type { TInvoiceEndpoint } from "./TInvoiceEndpoint";

export type TInvoiceDetailProduct = {
  id: number;
  quantity: number;
  name?: string;
  sku?: string;
  unit_price?: number;
  tax_id?: number;
};

export type TInvoiceDetail = Omit<TInvoiceEndpoint, "products"> & {
  products: TInvoiceDetailProduct[];
};
