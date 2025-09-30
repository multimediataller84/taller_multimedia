export type TInvoice = {
  id: string;
  amount: number;
  dueRemaining: number;
  createdAt: string;
  locked?: boolean;
};

export type TPayment = {
  id: string;
  invoiceId: string;
  amount: number;
  createdAt: string;
  locked?: boolean;
};

export type TCredit = {
  clientId: number;
  assigned: number;
  remaining: number;
  createdAt: string;
  updatedAt: string;
  invoices: TInvoice[];
  payments: TPayment[];
};

export type TCreditCreate = {
  clientId: number;
  amount: number;
};
