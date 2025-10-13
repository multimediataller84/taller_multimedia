import type { TPaymentMethod } from "./TPaymentMethod";

export type TInvoiceProduct = {
  id: number; // product id
  quantity: number;
};

export type TInvoice = {
  customer_id: number;
  issue_date: string; // ISO string generated at creation
  due_date?: string | null;
  payment_method: TPaymentMethod;
  products: TInvoiceProduct[];
  status: string;
  user_id: number;
  cash_register_id: number;
  amount_paid?: number; // optional initial payment (e.g., when using Credit)
};
