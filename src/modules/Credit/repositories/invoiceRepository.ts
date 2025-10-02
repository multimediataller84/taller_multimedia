import apiClient from "../../Login/interceptors/apiClient";

const unwrap = <T,>(res: any): T => {
  if (!res) return res as T;
  if (res.data?.data) return res.data.data as T;
  if (res.data?.rows) return res.data.rows as T;
  if (res.data) return res.data as T;
  return res as T;
};

export type TPaymentMethod = "Cash" | "Credit" | "Debit Card" | "Transfer";
export type TInvoiceStatus = "Pending" | "Paid" | "Partial" | "Canceled"; // ajusta si tu back usa otros literales

export type BackInvoice = {
  id: number;
  customer_id: number;
  issue_date: string | null;
  due_date: string | null;
  subtotal: number;
  tax_total: number;
  total: number;
  amount_paid: number;
  payment_method: TPaymentMethod;
  status: TInvoiceStatus;
  invoice_number: string;
  digital_signature?: string | null;
  biometric_hash?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export const invoiceRepository = {
  async getByCustomer(customerId: number): Promise<BackInvoice[]> {
    try {
      const res = await apiClient.get(`/invoice/all`, { params: { customer_id: customerId } });
      return unwrap<BackInvoice[]>(res) ?? [];
    } catch (e: any) {
      if (e?.response?.status === 404) return [];
      throw e;
    }
  },

  // Eliminar factura en el backend; el back debe ajustar el crédito/balance en cascada
  async deleteInvoice(invoiceId: number): Promise<void> {
    await apiClient.delete(`/invoice/${invoiceId}`);
  },
};
