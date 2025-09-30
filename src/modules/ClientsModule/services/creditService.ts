// services/creditService.ts
import  apiClient  from "../../Login/interceptors/apiClient";
import type {
  TCredit,
  TCreditEndpoint,
  TCreditPayment,
  CreditSummary,
  BackCreditStatus,
  FrontCreditStatus,
} from "../models/types/TCredit";
import { mapStatusBackToFront } from "../models/types/TCredit";

// Normalizador genérico de respuestas {data} | {rows} | array
const unwrap = <T>(res: any): T => {
  if (!res) return res;
  if (res.data?.data) return res.data.data as T;
  if (res.data?.rows) return res.data.rows as T;
  if (res.data) return res.data as T;
  return res as T;
};

// Mapper de crédito back → front
const mapCreditBackToFront = (raw: any): TCreditEndpoint => {
  const approved = Number(raw?.approved_credit_amount ?? 0);
  const balance = Number(raw?.balance ?? 0);
  return {
    id: raw?.id,
    customer_id: raw?.customer_id,
    approved_credit_amount: approved,
    balance,
    status: mapStatusBackToFront(raw?.status as BackCreditStatus),
    created_at: raw?.createdAt ?? raw?.created_at,
    updated_at: raw?.updatedAt ?? raw?.updated_at,
    credit_amount: approved,
    used: Math.max(approved - balance, 0),
  };
};

export const creditService = {
  // === CRÉDITO ===
  async listByCustomer(customerId: number): Promise<TCreditEndpoint[]> {
    try {
      const res = await apiClient.get(`/credit/all`, { params: { customer_id: customerId } });
      const rows = unwrap<any[]>(res) ?? [];
      return rows.map(mapCreditBackToFront);
    } catch (e: any) {
      // fallback si /credit/all no acepta customer_id
      if (e?.response?.status === 404) return [];
      const res = await apiClient.get(`/credit/all`);
      const rows = unwrap<any[]>(res) ?? [];
      return rows
        .filter((c: any) => c.customer_id === customerId)
        .map(mapCreditBackToFront);
    }
  },

  async request(customerId: number, payload: TCredit): Promise<TCreditEndpoint> {
    const amount = Number(payload.credit_amount ?? 0);
    // El back no maneja due_date/note en Credit; solo enviamos lo que espera
    const body = {
      customer_id: customerId,
      approved_credit_amount: amount,
      balance: amount,
      status: "Pending" as BackCreditStatus,
    };
    const res = await apiClient.post(`/credit`, body);
    return mapCreditBackToFront(unwrap<any>(res));
  },

  async approve(creditId: number): Promise<TCreditEndpoint> {
    const res = await apiClient.patch(`/credit/${creditId}`, { status: "Aproved" as BackCreditStatus });
    return mapCreditBackToFront(unwrap<any>(res));
  },

  async reject(creditId: number): Promise<TCreditEndpoint> {
    const res = await apiClient.patch(`/credit/${creditId}`, { status: "Revoked" as BackCreditStatus });
    return mapCreditBackToFront(unwrap<any>(res));
  },

  async close(creditId: number): Promise<TCreditEndpoint> {
    const res = await apiClient.patch(`/credit/${creditId}`, { status: "Revoked" as BackCreditStatus });
    return mapCreditBackToFront(unwrap<any>(res));
  },

  // === PAGOS ===
  async addPayment(args: {
    credit_id: number;
    amount: number;
    payment_date?: string; // ISO
    payment_method_id?: number;
    note?: string | null;
  }): Promise<TCreditPayment> {
    const body = {
      credit_id: args.credit_id,
      amount: Number(args.amount),
      payment_date: args.payment_date ?? new Date().toISOString(),
      payment_method_id: args.payment_method_id ?? 1,
      note: args.note ?? null,
    };
    const res = await apiClient.post(`/credit/payment`, body);
    return unwrap<TCreditPayment>(res);
  },

  async listPayments(creditId: number): Promise<TCreditPayment[]> {
    try {
      const res = await apiClient.get(`/credit/payment/all`, { params: { credit_id: creditId } });
      return unwrap<TCreditPayment[]>(res) ?? [];
    } catch (e: any) {
      if (e?.response?.status === 404) return [];
      throw e;
    }
  },

  async deletePayment(paymentId: number): Promise<void> {
    await apiClient.delete(`/credit/payment/${paymentId}`);
  },

  // === SUMMARY ===
  async getSummary(customerId: number): Promise<CreditSummary> {
    const credits = await this.listByCustomer(customerId);
    if (!credits?.length) {
      return { enabled: false, unlimited: false, limit: 0, used: 0, available: 0 };
    }
    const current =
      credits.find(c => c.status === "approved") ??
      credits.find(c => c.status === "pending_review") ??
      credits[0];

    const limit = Number(current.approved_credit_amount ?? current.credit_amount ?? 0);
    const used = Math.max(limit - Number(current.balance ?? 0), 0);
    const available = Math.max(limit - used, 0);

    return {
      enabled: true,
      unlimited: false,
      limit,
      used,
      available,
      creditId: current.id,
      status: current.status,
    };
  },
};
