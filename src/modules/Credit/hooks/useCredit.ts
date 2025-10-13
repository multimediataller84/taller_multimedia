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

// ===== Sincronización robusta =====
type TLastAction = "none" | "addPayment" | "removePayment";
const LOAD_DELAY_MS = 450;
const SYNC_RETRIES = 6;
const SYNC_INTERVAL_MS = 450;

// Tipo del resultado de createPayment sin importar BackPayment directamente
type CreatedPayment = Awaited<ReturnType<typeof repo.createPayment>>;

export function useCredit(clientId: number | null) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [credit, setCredit] = useState<UICredit | null>(null);

  // Ignorar respuestas viejas al cambiar de cliente
  const requestSeq = useRef(0);

  // Última mutación y su “objetivo” de remaining (para no retroceder)
  const lastActionRef = useRef<TLastAction>("none");
  const targetRemainingRef = useRef<number | null>(null);

  // Limpiar al cambiar cliente
  useEffect(() => {
    setCredit(null);
    setErrorMsg(null);
    lastActionRef.current = "none";
    targetRemainingRef.current = null;
  }, [clientId]);

  const hasCredit = !!credit;

  // helper: valida si el metodo de pago es "Credit"
  const isCreditMethod = (pm?: BackInvoice["payment_method"]) =>
    String(pm ?? "").toLowerCase() === "credit";

  const mapInvoices = (rows: BackInvoice[], currentId: number): UIInvoice[] => {
    const mineWithCredit = (rows ?? []).filter(
      r => Number(r.customer_id) === Number(currentId) && isCreditMethod(r.payment_method)
    );

    return mineWithCredit.map(inv => {
      const total = Number(inv.total ?? 0);
      const paid = Number(inv.amount_paid ?? 0);
      const due = Math.max(total - paid, 0);

      // ⬇️ FIX: preferimos createdAt; si solo hay issue_date (DATEONLY), agregamos T12:00:00
      const created =
        (inv as any).createdAt ??
        (inv.issue_date ? `${inv.issue_date}T12:00:00` : nowISO());

      return {
        id: String(inv.id),
        amount: total,
        dueRemaining: due,
        createdAt: created,
        locked: due === 0,
      };
    });
  };

  // Carga “cruda” desde backend (sin fusionar)
  const fetchRemote = useCallback(async (): Promise<UICredit | null> => {
    if (!clientId) return null;

    const back = await repo.getCreditByCustomer(clientId);
    if (!back) return null;

    if (Number(back.customer_id) !== Number(clientId)) {
      if (DEV) console.warn("[useCredit.fetchRemote] credit belongs to another customer",
        { returned: back.customer_id, expected: clientId });
      return null;
    }

    let paymentsRes: any[] = [];
    let invoicesRes: BackInvoice[] = [];
    try { paymentsRes = await repo.getPayments(back.id); } catch { /* noop */ }
    try { invoicesRes = await invoiceRepository.getByCustomer(clientId); } catch { /* noop */ }

    const remote: UICredit = {
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
        invoiceId: p.invoiceId
          ? String(p.invoiceId)
          : p.invoice_id
            ? String(p.invoice_id)
            : p.invoice?.id
              ? String(p.invoice.id)
              : undefined,
      })),
    };

    return remote;
  }, [clientId]);

  // load normal (sin objetivos)
  const load = useCallback(async () => {
    if (!clientId) { setCredit(null); return; }

    const mySeq = ++requestSeq.current;
    setLoading(true);
    setErrorMsg(null);

    try {
      const remote = await fetchRemote();
      if (mySeq !== requestSeq.current) return;

      setCredit(remote);
    } catch (e: any) {
      if (mySeq !== requestSeq.current) return;
      setCredit(null);
      setErrorMsg("No se pudo cargar el crédito");
      if (DEV) console.error("[useCredit.load] error:", e?.response?.status, e?.message);
    } finally {
      if (mySeq === requestSeq.current) setLoading(false);
    }
  }, [clientId, fetchRemote]);

  useEffect(() => { load(); }, [load]);

  // === Sincronización tras mutación con reintentos / objetivos ===
  const syncAfterMutation = useCallback(async () => {
    await new Promise(r => setTimeout(r, LOAD_DELAY_MS));

    for (let attempt = 0; attempt < SYNC_RETRIES; attempt++) {
      const mySeq = ++requestSeq.current;
      try {
        const remote = await fetchRemote();
        if (mySeq !== requestSeq.current) return;

        if (!remote) {
          await new Promise(r => setTimeout(r, SYNC_INTERVAL_MS));
          continue;
        }

        const last = lastActionRef.current;
        const target = targetRemainingRef.current;

        if (typeof target === "number") {
          const ok =
            (last === "addPayment" && remote.remaining >= target) ||
            (last === "removePayment" && remote.remaining <= target);

          if (!ok) {
            if (DEV) console.log("[syncAfterMutation] retry", { attempt, remote: remote.remaining, target, last });
            await new Promise(r => setTimeout(r, SYNC_INTERVAL_MS));
            continue;
          }
        }

        setCredit(prev => {
          if (!prev) return remote;
          let merged = remote.remaining;
          if (last === "addPayment" && typeof target === "number") {
            merged = Math.max(remote.remaining, target, prev.remaining);
          } else if (last === "removePayment" && typeof target === "number") {
            merged = Math.min(remote.remaining, target, prev.remaining);
          }
          return { ...remote, remaining: merged };
        });

        lastActionRef.current = "none";
        targetRemainingRef.current = null;
        return;
      } catch {
        await new Promise(r => setTimeout(r, SYNC_INTERVAL_MS));
      }
    }

    lastActionRef.current = "none";
    targetRemainingRef.current = null;
  }, [fetchRemote]);

  // Crear línea de crédito
  const create = async (amount: number): Promise<OpRes> => {
    if (!clientId) return { ok: false, message: "Cliente inválido" };

    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      return { ok: false, message: "Monto inválido" };
    }

    try {
      const created = await repo.createCredit(clientId, amt);

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

      await load();
      return { ok: true };
    } catch (e: any) {
      setErrorMsg("No se pudo crear el crédito");
      return { ok: false, message: "No se pudo crear el crédito" };
    }
  };

  // Abonar a una factura (crea CreditPayment)
  const payInvoice = (invoiceId: string, amount: number): OpRes => {
    if (!credit) return { ok: false, message: "No hay crédito" };
    const inv = credit.invoices.find(i => i.id === invoiceId);
    if (!inv) return { ok: false, message: "Factura no encontrada" };

    const payAmt = Number(amount);
    if (payAmt <= 0) return { ok: false, message: "Monto inválido" };
    if (payAmt > inv.dueRemaining) return { ok: false, message: "Excede el saldo de la factura" };

    // Optimista: bajar dueRemaining y subir disponible (remaining)
    let optimisticTarget = 0;
    setCredit(prev => {
      if (!prev) return prev;
      const newDue = inv.dueRemaining - payAmt;
      const invoices = prev.invoices.map(i =>
        i.id === inv.id ? { ...i, dueRemaining: newDue, locked: newDue === 0 } : i
      );
      const newRemaining = prev.remaining + payAmt;
      optimisticTarget = newRemaining;
      return { ...prev, invoices, remaining: newRemaining };
    });
    lastActionRef.current = "addPayment";
    targetRemainingRef.current = optimisticTarget;

    const DEFAULT_METHOD: TPaymentMethod = "Cash";

    repo.createPayment({
      credit_id: credit.id,
      amount: payAmt,
      payment_method: DEFAULT_METHOD,
      invoice_id: Number(invoiceId),
      note: null,
    })
      .then((saved: CreatedPayment) => {
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

        syncAfterMutation();
      })
      .catch(() => {
        setCredit(prev => {
          if (!prev) return prev;
          const invoices = prev.invoices.map(i =>
            i.id === inv.id ? { ...i, dueRemaining: inv.dueRemaining, locked: inv.dueRemaining === 0 } : i
          );
          return { ...prev, invoices, remaining: Math.max(prev.remaining - payAmt, 0) };
        });
        lastActionRef.current = "none";
        targetRemainingRef.current = null;
      });

    return { ok: true };
  };

  // Cancelar factura: abonar TODO lo pendiente y bloquearla (pagada)
  const cancelInvoice = (invoiceId: string): OpRes => {
    if (!credit) return { ok: false, message: "No hay crédito" };
    const inv = credit.invoices.find(i => i.id === invoiceId);
    if (!inv) return { ok: false, message: "Factura no encontrada" };
    if (inv.dueRemaining <= 0) return { ok: true };

    return payInvoice(invoiceId, inv.dueRemaining);
  };

  // Eliminar factura (no cambia remaining aquí; lo hará el back)
  const removeInvoice = (invoiceId: string): OpRes => {
    if (!credit) return { ok: false, message: "No hay crédito" };

    const prevSnapshot = credit.invoices;
    setCredit(prev => prev ? {
      ...prev,
      invoices: prev.invoices.filter(i => i.id !== invoiceId),
    } : prev);

    invoiceRepository.deleteInvoice(Number(invoiceId))
      .then(() => load())
      .catch(() => {
        setCredit(prev => prev ? { ...prev, invoices: prevSnapshot } : prev);
      });

    return { ok: true };
  };

  // Eliminar pago
  const removePayment = (paymentId: string | number): OpRes => {
    if (!credit) return { ok: false, message: "No hay crédito" };

    const pay = credit.payments.find(p => String(p.id) === String(paymentId));
    if (!pay) return { ok: false, message: "Pago no encontrado" };

    let optimisticTarget = 0;
    setCredit(prev => prev ? {
      ...prev,
      payments: prev.payments.filter(p => String(p.id) !== String(paymentId)),
      remaining: (optimisticTarget = Math.max(prev.remaining - pay.amount, 0)),
      invoices: pay.invoiceId
        ? prev.invoices.map(i =>
            i.id === pay.invoiceId
              ? { ...i, dueRemaining: i.dueRemaining + pay.amount, locked: false }
              : i
          )
        : prev.invoices,
    } : prev);
    lastActionRef.current = "removePayment";
    targetRemainingRef.current = optimisticTarget;

    repo.deletePayment(Number(paymentId))
      .then(() => {
        syncAfterMutation();
      })
      .catch(() => {
        setCredit(prev => {
          if (!prev) return prev;

          const reverted: UICredit = {
            ...prev,
            payments: [pay, ...(prev.payments ?? [])],
            remaining: prev.remaining + pay.amount,
          };

          if (pay.invoiceId) {
            reverted.invoices = reverted.invoices.map(i =>
              i.id === pay.invoiceId
                ? {
                    ...i,
                    dueRemaining: Math.max(i.dueRemaining - pay.amount, 0),
                    locked: i.dueRemaining - pay.amount === 0,
                  }
                : i
            );
          }

          return reverted;
        });
        lastActionRef.current = "none";
        targetRemainingRef.current = null;
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
