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
const DEV = typeof import.meta !== "undefined" && import.meta.env?.MODE !== "production";

type OpRes = { ok: true } | { ok: false; message: string };

export function useCredit(clientId: number | null) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [credit, setCredit] = useState<UICredit | null>(null);

  // Ignorar respuestas viejas al cambiar de cliente
  const requestSeq = useRef(0);

  // Limpiar al cambiar cliente
  useEffect(() => {
    setCredit(null);
    setErrorMsg(null);
  }, [clientId]);

  const hasCredit = !!credit;

  const mapInvoices = (rows: BackInvoice[], currentId: number): UIInvoice[] => {
    const onlyMine = (rows ?? []).filter(r => Number(r.customer_id) === Number(currentId));
    return onlyMine.map(inv => {
      const total = Number(inv.total ?? 0);
      const paid = Number(inv.amount_paid ?? 0);
      const due = Math.max(total - paid, 0);
      return {
        id: String(inv.id),
        amount: total,
        dueRemaining: due,
        createdAt: (inv.issue_date as unknown as string) ?? inv.createdAt ?? nowISO(),
        locked: due === 0, // ✅ bloqueada cuando está saldada
      };
    });
  };

  const load = useCallback(async () => {
    if (!clientId) { setCredit(null); return; }

    const mySeq = ++requestSeq.current;
    setCredit(null);
    setLoading(true);
    setErrorMsg(null);
    if (DEV) console.log("[useCredit.load] start for clientId:", clientId, "seq:", mySeq);

    try {
      const back = await repo.getCreditByCustomer(clientId);
      if (mySeq !== requestSeq.current) return;

      if (!back) {
        if (DEV) console.log("[useCredit.load] no credit for clientId:", clientId);
        setCredit(null);
        return;
      }

      if (Number(back.customer_id) !== Number(clientId)) {
        if (DEV) console.warn("[useCredit.load] credit belongs to another customer",
          { returned: back.customer_id, expected: clientId });
        setCredit(null);
        return;
      }

      let paymentsRes: any[] = [];
      let invoicesRes: BackInvoice[] = [];

      try { paymentsRes = await repo.getPayments(back.id); }
      catch (ep) { if (DEV) console.warn("[useCredit.load] getPayments failed, []", ep); }

      try { invoicesRes = await invoiceRepository.getByCustomer(clientId); }
      catch (ei) { if (DEV) console.warn("[useCredit.load] getByCustomer failed, []", ei); }

      if (mySeq !== requestSeq.current) return;

      const ui: UICredit = {
        id: back.id,
        customer_id: back.customer_id,
        assigned: Number(back.approved_credit_amount ?? 0),
        remaining: Number(back.balance ?? 0),
        status: mapStatus(back.status),
        createdAt: back.createdAt ?? undefined,
        invoices: mapInvoices(invoicesRes, clientId),
        payments: (paymentsRes ?? []).map(p => ({
          id: p.id,
          amount: Number(p.amount),
          createdAt: p.createdAt ?? nowISO(),
          locked: false,
        })),
      };

      if (DEV) console.log("[useCredit.load] setCredit for clientId:", clientId, "creditId:", back.id,
        "invoices:", ui.invoices.length, "payments:", ui.payments.length);

      setCredit(ui);
    } catch (e: any) {
      if (mySeq !== requestSeq.current) return;
      setCredit(null);
      setErrorMsg("No se pudo cargar el crédito");
      if (DEV) console.error("[useCredit.load] error for clientId:", clientId, e?.response?.status, e?.message);
    } finally {
      if (mySeq === requestSeq.current) setLoading(false);
    }
  }, [clientId]);

  useEffect(() => { load(); }, [load]);

  // Crear línea de crédito
  const create = async (amount: number): Promise<OpRes> => {
    if (!clientId) return { ok: false, message: "Cliente inválido" };

    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      return { ok: false, message: "Monto inválido" };
    }

    try {
      const created = await repo.createCredit(clientId, amt);

      // Estado optimista
      setCredit({
        id: created.id,
        customer_id: created.customer_id,
        assigned: Number(created.approved_credit_amount ?? amt),
        remaining: Number(created.balance ?? amt),
        status: mapStatus(created.status),
        createdAt: created.createdAt ?? undefined,
        invoices: [],
        payments: [],
      });

      await load(); // sincronizar
      return { ok: true };
    } catch (e: any) {
      setErrorMsg("No se pudo crear el crédito");
      return { ok: false, message: "No se pudo crear el crédito" };
    }
  };

  // Abonar a una factura (crea CreditPayment en el back)
  const payInvoice = (invoiceId: string, amount: number): OpRes => {
    if (!credit) return { ok: false, message: "No hay crédito" };
    const inv = credit.invoices.find(i => i.id === invoiceId);
    if (!inv) return { ok: false, message: "Factura no encontrada" };

    const payAmt = Number(amount);
    if (payAmt <= 0) return { ok: false, message: "Monto inválido" };
    if (payAmt > inv.dueRemaining) return { ok: false, message: "Excede el saldo de la factura" };

    // Optimista: bajar dueRemaining en UI y bloquear si quedó saldada
    setCredit(prev => {
      if (!prev) return prev;
      const newDue = inv.dueRemaining - payAmt;
      const invoices = prev.invoices.map(i =>
        i.id === inv.id
          ? { ...i, dueRemaining: newDue, locked: newDue === 0 }
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
        load(); // recarga para traer balances/estado desde el back
      })
      .catch(() => {
        // revertir UI si falla
        setCredit(prev => {
          if (!prev) return prev;
          const invoices = prev.invoices.map(i =>
            i.id === inv.id ? { ...i, dueRemaining: inv.dueRemaining, locked: inv.dueRemaining === 0 } : i
          );
          return { ...prev, invoices };
        });
      });

    return { ok: true };
    };

  // Cancelar factura: abonar automáticamente TODO lo pendiente y bloquearla (pagada)
  const cancelInvoice = (invoiceId: string): OpRes => {
    if (!credit) return { ok: false, message: "No hay crédito" };
    const inv = credit.invoices.find(i => i.id === invoiceId);
    if (!inv) return { ok: false, message: "Factura no encontrada" };
    if (inv.dueRemaining <= 0) return { ok: true }; // ya está saldada

    // Reutiliza payInvoice con el total pendiente
    return payInvoice(invoiceId, inv.dueRemaining);
  };

  // Eliminar factura: llama al back y recarga (el back debe ajustar el balance)
  const removeInvoice = (invoiceId: string): OpRes => {
    if (!credit) return { ok: false, message: "No hay crédito" };

    // Optimista: sacar la factura de la lista (el back ajustará balance)
    const prevSnapshot = credit.invoices;
    setCredit(prev => prev ? {
      ...prev,
      invoices: prev.invoices.filter(i => i.id !== invoiceId),
    } : prev);

    invoiceRepository.deleteInvoice(Number(invoiceId))
      .then(() => load())
      .catch(() => {
        // revert si falla
        setCredit(prev => prev ? { ...prev, invoices: prevSnapshot } : prev);
      });

    return { ok: true };
  };

  // Eliminar pago
  const removePayment = (paymentId: string | number): OpRes => {
    if (!credit) return { ok: false, message: "No hay crédito" };

    const pay = credit.payments.find(p => String(p.id) === String(paymentId));
    if (!pay) return { ok: false, message: "Pago no encontrado" };

    // Optimista
    setCredit(prev => prev ? { ...prev, payments: prev.payments.filter(p => String(p.id) !== String(paymentId)) } : prev);

    if (pay.invoiceId) {
      setCredit(prev => {
        if (!prev) return prev;
        const invoices = prev.invoices.map(i => i.id === pay.invoiceId ? { ...i, dueRemaining: i.dueRemaining + pay.amount, locked: false } : i);
        return { ...prev, invoices };
      });
    }

    repo.deletePayment(Number(paymentId))
      .then(() => load())
      .catch(() => {
        // revert
        setCredit(prev => prev ? { ...prev, payments: [pay, ...(prev.payments ?? [])] } : prev);

        if (pay.invoiceId) {
          setCredit(prev => {
            if (!prev) return prev;
            const invoices = prev.invoices.map(i => i.id === pay.invoiceId ? { ...i, dueRemaining: Math.max(i.dueRemaining - pay.amount, 0), locked: i.dueRemaining - pay.amount === 0 } : i);
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
    // Facturas (vienen del módulo de facturación)
    payInvoice,
    cancelInvoice,
    removeInvoice,
    // Pagos
    removePayment,
    // Crédito
    removeCredit,
    loading,
    errorMsg,
  };
}
