// módulo de crédito / TCredit.ts
export type CreditStatusFront = "pending_review" | "approved" | "closed";
export type CreditStatusBack = "Pending" | "Aproved" | "Revoked";

export const mapStatusBackToFront = (s?: CreditStatusBack): CreditStatusFront =>
  s === "Aproved" ? "approved" : s === "Revoked" ? "closed" : "pending_review";

export const mapStatusFrontToBack = (s?: CreditStatusFront): CreditStatusBack =>
  s === "approved" ? "Aproved" : s === "closed" ? "Revoked" : "Pending";

// Lo que la UI espera (CreditBalance usa assigned y remaining)
export type TCredit = {
  id: number;
  customer_id: number;
  assigned: number;   // approved_credit_amount del back
  remaining: number;  // balance del back
  status: CreditStatusFront;
  created_at?: string | Date;
  updated_at?: string | Date;
};

// Factura “local” para UI de crédito
export type TInvoice = {
  id: string;              // UUID local o id si decides persistir en otro módulo
  amount: number;          // total de la factura
  dueRemaining: number;    // saldo pendiente de esa factura
  createdAt: string;       // ISO
  locked?: boolean;        // si tiene pagos, podrías bloquear delete/cancel
};

// Pago (mapeable al back /credit/payment)
export type TPayment = {
  id: number;
  credit_id: number;
  amount: number;
  createdAt: string; // ISO
};
