export type TInvoiceEndpoint = {
  id: number;
  customer_id: number;
  issue_date?: string | null;
  due_date?: string | null;
  subtotal?: string | number | null;
  tax_total?: string | number | null;
  total?: string | number | null;
  amount_paid?: string | number | null;
  payment_method: string;
  products?: { id: number; quantity: number }[];
  status: string;
  invoice_number?: string;
  createdAt?: string;
  updatedAt?: string;
  customer?: {
    id: number;
    name: string;
    last_name: string;
    address?: string | null;
    id_number?: string | null;
    phone?: number | string | null;
    email?: string | null;
  };
};
