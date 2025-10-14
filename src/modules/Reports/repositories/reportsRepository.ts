import apiClient from "../../Login/interceptors/apiClient";

const unwrap = <T,>(res: any): T => {
  if (!res) return res as T;
  if (res.data?.data) return res.data.data as T;
  if (res.data?.rows) return res.data.rows as T;
  if (res.data) return res.data as T;
  return res as T;
};

export type TPaymentMethod = "Cash" | "Credit" | "Debit Card" | "Transfer";
export type TInvoiceStatus = "Issued" | "Pending" | "Canceled";

export type InvoiceRow = {
  id: number;
  customer_id: number;
  issue_date: string | null;
  subtotal: number;
  tax_total: number;
  total: number;
  amount_paid: number;
  payment_method: TPaymentMethod;
  status: TInvoiceStatus;
  invoice_number: string;
  createdAt?: string; updatedAt?: string;
  customer?: { id: number; name: string; last_name: string };
  products?: any[];
};

export type CreditRow = {
  id: number;
  customer_id: number;
  approved_credit_amount: number;
  balance: number;
  status: "Pending" | "Aproved" | "Revoked";
};

export type CreditPaymentRow = {
  id: number;
  credit_id: number;
  invoice_id: number;
  payment_date: string;
  amount: number;
  payment_method: TPaymentMethod;
  createdAt?: string;
};

export const reportsRepository = {
  async getInvoices(): Promise<InvoiceRow[]> {
    const res = await apiClient.get(`/invoice/all`);
    return unwrap<InvoiceRow[]>(res) ?? [];
  },
  async getCredits(): Promise<CreditRow[]> {
    const res = await apiClient.get(`/credit/all`);
    return unwrap<CreditRow[]>(res) ?? [];
  },
  async getCreditPayments(): Promise<CreditPaymentRow[]> {
    try {
      const res = await apiClient.get(`/credit/payment/all`);
      return unwrap<CreditPaymentRow[]>(res) ?? [];
    } catch (err: any) {
      console.warn("[reportsRepository] credit payments not available:", err?.response?.status);
      return [];
    }
  },
};
