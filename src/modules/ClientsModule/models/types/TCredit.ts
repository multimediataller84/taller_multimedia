// models/types/TCredit.ts

// Estados del BACK (tal y como vienen en tu API)
export type BackCreditStatus = "Pending" | "Aproved" | "Revoked";

// Estados del FRONT (los que usa tu UI)
export type FrontCreditStatus =
  | "pending_review"
  | "approved"
  | "closed"; // si tu UI distingue "rejected", puedes agregarlo

export const mapStatusBackToFront = (s?: BackCreditStatus): FrontCreditStatus => {
  switch (s) {
    case "Aproved":
      return "approved";
    case "Revoked":
      return "closed"; // o "rejected" si prefieres
    case "Pending":
    default:
      return "pending_review";
  }
};

export const mapStatusFrontToBack = (s?: FrontCreditStatus): BackCreditStatus => {
  switch (s) {
    case "approved":
      return "Aproved";
    case "closed":
      return "Revoked";
    case "pending_review":
    default:
      return "Pending";
  }
};

// ---- Créditos ----

// Para formularios del front (solicitud/aprobación)
export type TCredit = {
  credit_amount: number;       // monto solicitado/aprobado (front)
  due_date?: string;           // si lo usas en front; el back NO lo guarda por ahora
  note?: string | null;        // idem
};

// Lo que consume la tabla del front (endpoint normalizado)
export type TCreditEndpoint = {
  id: number;
  customer_id: number;
  approved_credit_amount: number; // del back
  balance: number;
  status: FrontCreditStatus;
  created_at?: string | Date;
  updated_at?: string | Date;

  // auxiliares para UI
  credit_amount?: number; // espejo de approved_credit_amount para columnas "Monto"
  used?: number;          // approved - balance
};

// ---- Pagos ----
export type TCreditPayment = {
  id: number;
  credit_id: number;
  amount: number;
  payment_date?: string | Date;
  payment_method_id?: number;
  note?: string | null;
  created_at?: string | Date;
  updated_at?: string | Date;
};

// ---- Summary que usa CreditSummary ----
export type CreditSummary = {
  enabled: boolean;
  unlimited: boolean;
  limit: number | "infinite";
  used: number;
  available: number | "infinite";
  creditId?: number;
  status?: FrontCreditStatus;
};
