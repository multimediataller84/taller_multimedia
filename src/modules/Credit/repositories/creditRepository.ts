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

export type BackPayment = {
  id: number;
  credit_id: number;
  amount: number;
  payment_date?: string;
  createdAt?: string; updatedAt?: string;
};

export const creditRepository = {
  async getCreditByCustomer(customerId: number): Promise<BackCredit | null> {
    try {
      const res = await apiClient.get(`/credit/all`, { params: { customer_id: customerId } });
      const rows = unwrap<any[]>(res) ?? [];
      return rows[0] ?? null;
    } catch (e: any) {
      if (e?.response?.status === 404) return null; // ✅ “sin crédito” es válido
      try {
        const res = await apiClient.get(`/credit/all`);
        const rows = unwrap<any[]>(res) ?? [];
        return rows.find((x: any) => x?.customer_id === customerId) ?? null;
      } catch (e2: any) {
        if (e2?.response?.status === 404) return null;
        throw e2;
      }
    }
  },

  async getPayments(creditId: number): Promise<BackPayment[]> {
    try {
      const res = await apiClient.get(`/credit/payment/all`, { params: { credit_id: creditId } });
      return unwrap<BackPayment[]>(res) ?? [];
    } catch (e: any) {
      if (e?.response?.status === 404) return []; // ✅ “sin pagos” es válido
      throw e;
    }
  },

  // ⬇️ Versión con diagnóstico de token y header Authorization forzado
  async createCredit(customerId: number, amount: number): Promise<BackCredit> {
    const body = {
      customer_id: customerId,
      approved_credit_amount: Number(amount),
      balance: Number(amount),
      status: "Pending" as const, // el back espera "Pending" | "Aproved" | "Revoked"
    };

    // Diagnóstico: ¿tenemos token?
    const token = sessionStorage.getItem("authToken");
    if (import.meta.env.MODE !== "production") {
      console.log("[createCredit] body:", body, "hasToken:", !!token);
    }

    // Forzamos Authorization en este POST (además del interceptor)
    const res = await apiClient.post(
      `/credit`,
      body,
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
    );

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

  async createPayment(creditId: number, amount: number): Promise<BackPayment> {
    const res = await apiClient.post(`/credit/payment`, {
      credit_id: creditId,
      amount: Number(amount),
      payment_date: new Date().toISOString(),
      payment_method_id: 1,
      note: null,
    });
    return unwrap<BackPayment>(res);
  },

  async deletePayment(paymentId: number): Promise<void> {
    await apiClient.delete(`/credit/payment/${paymentId}`);
  },
};
