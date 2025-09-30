import type { TCredit, TCreditCreate, TInvoice, TPayment } from "../models/types/TCredit";

const STORAGE_KEY = "credits";
type CreditMap = Record<string, TCredit>;

function read(): CreditMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function write(map: CreditMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalize(rec: any): TCredit {
  const invoices: TInvoice[] = Array.isArray(rec.invoices)
    ? rec.invoices.map((i: any) => ({
        id: String(i.id ?? uid()),
        amount: Number(i.amount ?? 0),
        dueRemaining: Number(i.dueRemaining ?? i.amount ?? 0),
        createdAt: i.createdAt ?? new Date().toISOString(),
        locked: !!i.locked,
      }))
    : [];

  const payments: TPayment[] = Array.isArray(rec.payments)
    ? rec.payments.map((p: any) => ({
        id: String(p.id ?? uid()),
        invoiceId: String(p.invoiceId ?? ""),
        amount: Number(p.amount ?? 0),
        createdAt: p.createdAt ?? new Date().toISOString(),
        locked: !!p.locked,
      }))
    : [];

  return {
    clientId: Number(rec.clientId ?? 0),
    assigned: Number(rec.assigned ?? 0),
    remaining: Number(rec.remaining ?? 0),
    createdAt: rec.createdAt ?? new Date().toISOString(),
    updatedAt: rec.updatedAt ?? new Date().toISOString(),
    invoices,
    payments,
  };
}

export const creditRepository = {
  
  getByClientId(clientId: number): TCredit | null {
    const map = read();
    const raw = map[String(clientId)];
    if (!raw) return null;
    const rec = normalize(raw);
    map[String(clientId)] = rec;
    write(map);
    return rec;
  },

  create(payload: TCreditCreate): TCredit {
    const now = new Date().toISOString();
    const map = read();
    const record: TCredit = {
      clientId: payload.clientId,
      assigned: payload.amount,
      remaining: payload.amount,
      createdAt: now,
      updatedAt: now,
      invoices: [],
      payments: [],
    };
    map[String(payload.clientId)] = record;
    write(map);
    return record;
  },

  addInvoice(clientId: number, amount: number): { ok: boolean; credit: TCredit | null } {
    const map = read();
    const key = String(clientId);
    const rec = normalize(map[key]);
    if (!rec) return { ok: false, credit: null };

    if (amount > rec.remaining) {
      return { ok: false, credit: rec };
    }

    const inv: TInvoice = {
      id: uid(),
      amount,
      dueRemaining: amount,
      createdAt: new Date().toISOString(),
      locked: false,
    };

    rec.invoices.unshift(inv);
    rec.remaining = Math.max(0, rec.remaining - amount);
    rec.updatedAt = new Date().toISOString();

    map[key] = rec;
    write(map);
    return { ok: true, credit: rec };
  },

  removeInvoice(clientId: number, invoiceId: string): TCredit | null {
    const map = read();
    const key = String(clientId);
    const rec = normalize(map[key]);
    if (!rec) return null;

    const idx = rec.invoices.findIndex(i => i.id === invoiceId);
    if (idx === -1) return rec;
    if (rec.invoices[idx].locked) return rec;

    const inv = rec.invoices[idx];

    rec.remaining = Math.min(rec.assigned, rec.remaining + inv.dueRemaining);

    rec.payments = rec.payments.filter(p => p.invoiceId !== invoiceId);

    rec.invoices.splice(idx, 1);

    rec.updatedAt = new Date().toISOString();
    map[key] = rec;
    write(map);
    return rec;
  },

  payInvoice(clientId: number, invoiceId: string, amount: number): { ok: boolean; credit: TCredit | null } {
    const map = read();
    const key = String(clientId);
    const rec = normalize(map[key]);
    if (!rec) return { ok: false, credit: null };

    const inv = rec.invoices.find(i => i.id === invoiceId);
    if (!inv || inv.locked) return { ok: false, credit: rec };

    const globalCap = Math.max(0, rec.assigned - rec.remaining);
    const maxAllowed = Math.min(inv.dueRemaining, globalCap);
    if (amount <= 0 || maxAllowed <= 0 || amount > maxAllowed) {
      return { ok: false, credit: rec };
    }

    const payment: TPayment = {
      id: uid(),
      invoiceId,
      amount,
      createdAt: new Date().toISOString(),
      locked: false,
    };

    inv.dueRemaining = Math.max(0, inv.dueRemaining - amount);
    rec.remaining = Math.min(rec.assigned, rec.remaining + amount);

    rec.payments.unshift(payment);
    rec.updatedAt = new Date().toISOString();

    map[key] = rec;
    write(map);
    return { ok: true, credit: rec };
  },

  removePayment(clientId: number, paymentId: string): TCredit | null {
    const map = read();
    const key = String(clientId);
    const rec = normalize(map[key]);
    if (!rec) return null;

    const idx = rec.payments.findIndex(p => p.id === paymentId);
    if (idx === -1) return rec;

    const pay = rec.payments[idx];
    if (pay.locked) return rec;

    const inv = rec.invoices.find(i => i.id === pay.invoiceId);
    if (!inv) return rec;

    inv.dueRemaining += pay.amount;
    rec.remaining = Math.max(0, rec.remaining - pay.amount);

    rec.payments.splice(idx, 1);
    rec.updatedAt = new Date().toISOString();

    map[key] = rec;
    write(map);
    return rec;
  },

  cancelInvoice(clientId: number, invoiceId: string): TCredit | null {
    const map = read();
    const key = String(clientId);
    const rec = normalize(map[key]);
    if (!rec) return null;

    const inv = rec.invoices.find(i => i.id === invoiceId);
    if (!inv || inv.locked) return rec;

    const missing = Math.max(0, inv.dueRemaining);
    const globalCap = Math.max(0, rec.assigned - rec.remaining);
    const autoPay = Math.min(missing, globalCap);

    const nowIso = new Date().toISOString();

    rec.payments = rec.payments.map(p => p.invoiceId === invoiceId ? { ...p, locked: true } : p);

    if (autoPay > 0) {
      const autoPayment: TPayment = {
        id: uid(),
        invoiceId,
        amount: autoPay,
        createdAt: nowIso,
        locked: true,
      };
      rec.payments.unshift(autoPayment);

      inv.dueRemaining = Math.max(0, inv.dueRemaining - autoPay);
      rec.remaining = Math.min(rec.assigned, rec.remaining + autoPay);
    }

    inv.locked = true;
    rec.updatedAt = nowIso;

    map[key] = rec;
    write(map);
    return rec;
  },

  cancelCredit(clientId: number): TCredit | null {
    const map = read();
    const key = String(clientId);
    const rec = normalize(map[key]);
    if (!rec) return null;

    const missing = Math.max(0, rec.assigned - rec.remaining);
    const nowIso = new Date().toISOString();

    rec.invoices = rec.invoices.map(i => ({ ...i, locked: true }));
    rec.payments = rec.payments.map(p => ({ ...p, locked: true }));

    if (missing > 0) {
      const autoPayment: TPayment = { id: uid(), invoiceId: "", amount: missing, createdAt: nowIso, locked: true };
      rec.payments.unshift(autoPayment);
    }

    rec.remaining = rec.assigned;
    rec.updatedAt = nowIso;

    map[key] = rec;
    write(map);
    return rec;
  },

  removeCredit(clientId: number): void {
    const map = read();
    delete map[String(clientId)];
    write(map);
  },
};
