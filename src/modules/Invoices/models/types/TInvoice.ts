export type TInvoiceProduct = {
  id: number; // product id
  quantity: number;
};

export type TInvoice = {
  customer_id: number;
  issue_date: string; // ISO string generated at creation
  due_date?: string | null; // optional for compatibility
  payment_method: string;
  products: TInvoiceProduct[];
  status: string; // e.g., 'Issued'
};
