import apiClient from "../../Login/interceptors/apiClient";

const unwrap = <T,>(res: any): T => {
  if (!res) return res;
  if (res.data?.data) return res.data.data as T;
  if (res.data?.rows) return res.data.rows as T;
  if (res.data) return res.data as T;
  return res as T;
};

export type BackCredit = {
  id: number;
  customer_id: number;
  approved_credit_amount: number;
  balance: number;
  status: "Pending" | "Aproved" | "Revoked";
  createdAt?: string; updatedAt?: string;
};

export type TPaymentMethod = "Cash" | "Credit" | "Debit Card" | "Transfer";

export type BackPayment = {
  id: number;
  credit_id: number;
  invoice_id?: number;
  amount: number;
  payment_date?: string;
  payment_method?: TPaymentMethod;
  note?: string | null;
  createdAt?: string; updatedAt?: string;
};

export const creditRepository = {
 async getCreditByCustomer(customerId: number): Promise<BackCredit | null> {
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const fetchAll = async () => {
    const res = await apiClient.get(`/credit/all`);
    const rows = unwrap<any[]>(res) ?? [];
    const found = rows.find((x: any) => Number(x?.customer_id) === Number(customerId)) ?? null;
    return found as BackCredit | null;
  };

  try {
    const found = await fetchAll();
    if (found) return found;

    return null;
  } catch (e1: any) {
    if (e1?.response?.status === 429) {
      await sleep(250);
      try {
        const found = await fetchAll();
        return found ?? null;
      } catch {
        return null;
      }
    }

    if (e1?.response?.status === 404) return null;

    return null;
  }
},

  async getPayments(creditId: number): Promise<BackPayment[]> {
    try {
      const res = await apiClient.get(`/credit/payment/all`, { params: { credit_id: creditId } });
      return unwrap<BackPayment[]>(res) ?? [];
    } catch (e: any) {
      if (e?.response?.status === 404) return [];
      throw e;
    }
  },

  async createCredit(customerId: number, amount: number): Promise<BackCredit> {
    const body = {
      customer_id: customerId,
      approved_credit_amount: Number(amount),
      balance: Number(amount),
      status: "Pending" as const,
    };

    const token = sessionStorage.getItem("authToken");
    if (import.meta.env.MODE !== "production") {
      console.log("[createCredit] body:", body, "hasToken:", !!token);
    }

    const res = await apiClient.post(`/credit`, body, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      withCredentials: false,
    });

    return unwrap<BackCredit>(res);
  },

  async patchCredit(
    creditId: number,
    partial: Partial<Pick<BackCredit, "approved_credit_amount" | "balance" | "status">>
  ): Promise<BackCredit> {
    const res = await apiClient.patch(`/credit/${creditId}`, partial);
    return unwrap<BackCredit>(res);
  },

  async deleteCredit(creditId: number): Promise<void> {
    await apiClient.delete(`/credit/${creditId}`);
  },

  async createPayment(payload: {
    credit_id: number;
    amount: number;
    payment_date?: string;
    payment_method?: TPaymentMethod;
    note?: string | null;
    invoice_id?: number;
  }): Promise<BackPayment> {
    const body = {
      credit_id: payload.credit_id,
      amount: Number(payload.amount),
      payment_date: payload.payment_date ?? new Date().toISOString(),
      ...(payload.payment_method ? { payment_method: payload.payment_method } : {}),
      ...(typeof payload.invoice_id === "number" ? { invoice_id: payload.invoice_id } : {}),
      note: payload.note ?? null,
    };

    const res = await apiClient.post(`/credit/payment`, body);
    return unwrap<BackPayment>(res);
  },

  async deletePayment(paymentId: number): Promise<void> {
    await apiClient.delete(`/credit/payment/${paymentId}`);
  },
};
