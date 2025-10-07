import { useCallback, useEffect, useRef, useState } from "react";
import { creditRepository as repo, BackCredit } from "../repositories/creditRepository";
import { invoiceRepository, BackInvoice, TPaymentMethod } from "../repositories/invoiceRepository";

type UIInvoice = { id: string; amount: number; dueRemaining: number; createdAt: string; locked?: boolean };
type UIPayment = { id: string | number; amount: number; createdAt: string; locked?: boolean; invoiceId?: string };

type UICredit = {
  id: number;
  customer_id: number;
  assigned: number;   // approved_credit_amount
  remaining: number;  // balance
  status: "pending_review" | "approved" | "closed";
  createdAt?: string;
  invoices: UIInvoice[];
  payments: UIPayment[];
};

const mapStatus = (s?: BackCredit["status"]): UICredit["status"] =>
  s === "Aproved" ? "approved" : s === "Revoked" ? "closed" : "pending_review";

const nowISO = () => new Date().toISOString();

type OpRes = { ok: true } | { ok: false; message: string };

export function useCredit(clientId: number | null) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [credit, setCredit] = useState<UICredit | null>(null);

  const requestSeq = useRef(0);

  useEffect(() => {
    setCredit(null);
    setErrorMsg(null);
  }, [clientId]);

  const hasCredit = !!credit;

  const mapInvoices = (rows: BackInvoice[]): UIInvoice[] => {
    return (rows ?? [])
      .filter(inv => inv?.payment_method === "Credit")
      .map(inv => {
        const total = Number(inv.total ?? 0);
        const paid  = Number(inv.amount_paid ?? 0);
        const due   = Math.max(total - paid, 0);
        return {
          id: String(inv.id),
          amount: total,
          dueRemaining: due,
          createdAt: (inv.issue_date as any) ?? inv.createdAt ?? nowISO(),
          locked: due > 0,
        };
      });
  };

  const load = useCallback(async () => {
    if (!clientId) { setCredit(null); return; }
    const seq = ++requestSeq.current;

    setLoading(true);
    setErrorMsg(null);
    try {
      const back = await repo.getCreditByCustomer(clientId);
      if (seq !== requestSeq.current) return;

      if (!back) { setCredit(null); return; }

      const [payments, invoices] = await Promise.all([
        repo.getPayments(back.id),
        invoiceRepository.getByCustomer(clientId),
      ]);

      if (seq !== requestSeq.current) return;

      const ui: UICredit = {
        id: back.id,
        customer_id: back.customer_id,
        assigned: Number(back.approved_credit_amount ?? 0),
        remaining: Number(back.balance ?? 0),
        status: mapStatus(back.status),
        createdAt: back.createdAt ?? undefined,
        invoices: mapInvoices(invoices),
        payments: (payments ?? []).map(p => ({
          id: p.id,
          amount: Number(p.amount),
          createdAt: p.createdAt ?? nowISO(),
          locked: false,
        })),
      };
      setCredit(ui);
    } catch (e: any) {
      setErrorMsg("No se pudo cargar el crédito");
    } finally {
      if (seq === requestSeq.current) setLoading(false);
    }
  }, [clientId]);

  useEffect(() => { load(); }, [load]);

  const create = async (amount: number): Promise<OpRes> => {
    if (!clientId) return { ok: false, message: "Cliente inválido" };

    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      return { ok: false, message: "Monto inválido" };
    }

    try {
      await repo.createCredit(clientId, amt);
      await load();
      return { ok: true };
    } catch {
      setErrorMsg("No se pudo crear el crédito");
      return { ok: false, message: "No se pudo crear el crédito" };
    }
  };

  const addInvoice = (_amount: number): OpRes => {
    return { ok: false, message: "Las facturas se crean desde el módulo de Facturación." };
  };

  const payInvoice = (invoiceId: string, amount: number): OpRes => {
    if (!credit) return { ok: false, message: "No hay crédito" };
    const inv = credit.invoices.find(i => i.id === invoiceId);
    if (!inv) return { ok: false, message: "Factura no encontrada" };

    const payAmt = Number(amount);
    if (payAmt <= 0) return { ok: false, message: "Monto inválido" };
    if (payAmt > inv.dueRemaining) return { ok: false, message: "Excede el saldo de la factura" };

    setCredit(prev => {
      if (!prev) return prev;
      const invoices = prev.invoices.map(i =>
        i.id === inv.id
          ? { ...i, dueRemaining: i.dueRemaining - payAmt, locked: (i.dueRemaining - payAmt) > 0 }
          : i
      );
      return { ...prev, invoices };
    });

    const DEFAULT_METHOD: TPaymentMethod = "Cash";

    repo.createPayment({
      credit_id: credit.id,
      amount: payAmt,
      payment_method: DEFAULT_METHOD,
      invoice_id: Number(invoiceId),
      note: null,
    })
      .then(saved => {
        setCredit(prev => prev ? {
          ...prev,
          payments: [
            {
              id: saved.id,
              amount: payAmt,
              createdAt: saved.createdAt ?? nowISO(),
              invoiceId,
            },
            ...prev.payments,
          ],
        } : prev);
        load();
      })
      .catch(() => {
        setCredit(prev => {
          if (!prev) return prev;
          const invoices = prev.invoices.map(i =>
            i.id === inv.id ? { ...i, dueRemaining: i.dueRemaining + payAmt } : i
          );
          return { ...prev, invoices };
        });
      });

    return { ok: true };
  };

  const cancelInvoice = (_invoiceId: string): OpRes =>
    ({ ok: false, message: "La gestión de facturas se realiza en el módulo de Facturación." });
  const removeInvoice = (_invoiceId: string): OpRes => cancelInvoice(_invoiceId);

  const removePayment = (paymentId: string | number): OpRes => {
    if (!credit) return { ok: false, message: "No hay crédito" };

    const pay = credit.payments.find(p => String(p.id) === String(paymentId));
    if (!pay) return { ok: false, message: "Pago no encontrado" };

    setCredit(prev => prev ? { ...prev, payments: prev.payments.filter(p => String(p.id) !== String(paymentId)) } : prev);

    if (pay.invoiceId) {
      setCredit(prev => {
        if (!prev) return prev;
        const invoices = prev.invoices.map(i => i.id === pay.invoiceId ? { ...i, dueRemaining: i.dueRemaining + pay.amount } : i);
        return { ...prev, invoices };
      });
    }

    repo.deletePayment(Number(paymentId))
      .then(() => load())
      .catch(() => {
        setCredit(prev => prev ? { ...prev, payments: [pay, ...(prev.payments ?? [])] } : prev);

        if (pay.invoiceId) {
          setCredit(prev => {
            if (!prev) return prev;
            const invoices = prev.invoices.map(i => i.id === pay.invoiceId ? { ...i, dueRemaining: Math.max(i.dueRemaining - pay.amount, 0) } : i);
            return { ...prev, invoices };
          });
        }
      });

    return { ok: true };
  };

  const removeCredit = async (): Promise<OpRes> => {
    if (!credit) return { ok: false, message: "No hay crédito" };
    try {
      await repo.deleteCredit(credit.id);
      setCredit(null);
      return { ok: true };
    } catch {
      return { ok: false, message: "No se pudo eliminar el crédito" };
    }
  };

  return {
    credit,
    hasCredit,
    create,
    addInvoice,      // deshabilitado
    removeInvoice,   // deshabilitado
    payInvoice,
    removePayment,
    cancelInvoice,   // deshabilitado
    removeCredit,
    loading,
    errorMsg,
  };
}
