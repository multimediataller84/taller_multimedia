import { useCallback, useEffect, useMemo, useState } from "react";
import { creditRepository as repo, BackCredit, BackPayment } from "../repositories/creditRepository";

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

  const hasCredit = !!credit;

  const load = useCallback(async () => {
    if (!clientId) { setCredit(null); return; }
    setLoading(true);
    setErrorMsg(null);
    try {
      const back = await repo.getCreditByCustomer(clientId);
      if (!back) { setCredit(null); return; }

      const payments = await repo.getPayments(back.id);
      const ui: UICredit = {
        id: back.id,
        customer_id: back.customer_id,
        assigned: Number(back.approved_credit_amount ?? 0),
        remaining: Number(back.balance ?? 0),
        status: mapStatus(back.status),
        createdAt: back.createdAt ?? undefined,
        invoices: [], // se manejan localmente en este módulo
        payments: (payments ?? []).map(p => ({
          id: p.id,
          amount: Number(p.amount),
          createdAt: p.createdAt ?? nowISO(),
          locked: false,
          // invoiceId se setea cuando el pago nace desde una factura concreta (ver payInvoice)
        })),
      };
      setCredit(ui);
    } catch (e: any) {
      setErrorMsg("No se pudo cargar el crédito");
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => { load(); }, [load]);

  // Crear línea de crédito (con validación, update optimista y reload)
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
    // 👇 extrae mensaje útil del backend si viene
    const msg =
      e?.response?.data?.message ||
      e?.response?.data?.error ||
      e?.message ||
      "No se pudo crear el crédito";

    setErrorMsg(msg);
    return { ok: false, message: msg };
  }
};

  // Eliminar crédito
  const removeCredit = async (): Promise<OpRes> => {
    if (!credit) return { ok: false, message: "No hay crédito" };
    try {
      await repo.deleteCredit(credit.id);
      setCredit(null);
      return { ok: true };
    } catch (e: any) {
      return { ok: false, message: "No se pudo eliminar el crédito" };
    }
  };

  // Agregar “factura” (cargo): descuenta del remaining y crea invoice local
  const addInvoice = (amount: number): OpRes => {
    if (!credit) return { ok: false, message: "No hay crédito" };
    const amt = Number(amount);
    if (amt <= 0) return { ok: false, message: "Monto inválido" };
    if (amt > credit.remaining) return { ok: false, message: "Excede el disponible" };

    const newRemaining = credit.remaining - amt;
    const inv: UIInvoice = {
      id: crypto.randomUUID(),
      amount: amt,
      dueRemaining: amt,
      createdAt: nowISO(),
      locked: false,
    };

    setCredit(prev => prev ? { ...prev, remaining: newRemaining, invoices: [inv, ...prev.invoices] } : prev);
    // Persistimos el nuevo balance inmediatamente
    repo.patchCredit(credit.id, { balance: newRemaining }).catch(() => {
      // si falla, revertimos visualmente
      setCredit(prev => prev ? { ...prev, remaining: credit.remaining, invoices: prev.invoices.filter(i => i.id !== inv.id) } : prev);
    });

    return { ok: true };
  };

  // Pagar una factura (abono): crea payment en back y baja dueRemaining
  const payInvoice = (invoiceId: string, amount: number): OpRes => {
    if (!credit) return { ok: false, message: "No hay crédito" };
    const inv = credit.invoices.find(i => i.id === invoiceId);
    if (!inv) return { ok: false, message: "Factura no encontrada" };

    const payAmt = Number(amount);
    if (payAmt <= 0) return { ok: false, message: "Monto inválido" };
    if (payAmt > inv.dueRemaining) return { ok: false, message: "Excede el saldo de la factura" };

    // Optimista: bajamos el dueRemaining
    setCredit(prev => {
      if (!prev) return prev;
      const invoices = prev.invoices.map(i => i.id === inv.id ? { ...i, dueRemaining: i.dueRemaining - payAmt, locked: (i.dueRemaining - payAmt) > 0 } : i);
      return { ...prev, invoices };
    });

    // Creamos el pago en el back (esto incrementa el balance disponible del crédito)
    repo.createPayment(credit.id, payAmt)
      .then(saved => {
        // asociamos el pago a la factura en memoria
        setCredit(prev => prev ? {
          ...prev,
          payments: [{ id: saved.id, amount: payAmt, createdAt: saved.createdAt ?? nowISO(), invoiceId }, ...prev.payments],
        } : prev);

        // recargamos el crédito (para traer remaining actualizado del back)
        load();
      })
      .catch(() => {
        // revertimos visualmente el dueRemaining si falla
        setCredit(prev => {
          if (!prev) return prev;
          const invoices = prev.invoices.map(i => i.id === inv.id ? { ...i, dueRemaining: i.dueRemaining + payAmt } : i);
          return { ...prev, invoices };
        });
      });

    return { ok: true };
  };

  // Cancelar factura (sin pagos): devuelve su dueRemaining al remaining
  const cancelInvoice = (invoiceId: string): OpRes => {
    if (!credit) return { ok: false, message: "No hay crédito" };
    const inv = credit.invoices.find(i => i.id === invoiceId);
    if (!inv) return { ok: false, message: "Factura no encontrada" };

    // Si tuviera pagos asociados, podrías bloquear aquí (tu UI lo avisa en el diálogo).
    const newRemaining = credit.remaining + inv.dueRemaining;

    // Optimista
    setCredit(prev => prev ? { ...prev, remaining: newRemaining, invoices: prev.invoices.filter(i => i.id !== invoiceId) } : prev);

    repo.patchCredit(credit.id, { balance: newRemaining }).catch(() => {
      // revertir
      setCredit(prev => prev ? { ...prev, remaining: credit.remaining, invoices: [inv, ...(prev.invoices ?? [])] } : prev);
    });

    return { ok: true };
  };

  // Eliminar factura (igual a cancelar)
  const removeInvoice = (invoiceId: string): OpRes => cancelInvoice(invoiceId);

  // Eliminar pago: borra en back y reajusta factura si estaba asociada
  const removePayment = (paymentId: string | number): OpRes => {
    if (!credit) return { ok: false, message: "No hay crédito" };

    // Buscamos el pago y su invoiceId
    const pay = credit.payments.find(p => String(p.id) === String(paymentId));
    if (!pay) return { ok: false, message: "Pago no encontrado" };

    // Optimista: quitamos el pago
    setCredit(prev => prev ? { ...prev, payments: prev.payments.filter(p => String(p.id) !== String(paymentId)) } : prev);

    // Si estaba ligado a una factura, subimos su dueRemaining
    if (pay.invoiceId) {
      setCredit(prev => {
        if (!prev) return prev;
        const invoices = prev.invoices.map(i => i.id === pay.invoiceId ? { ...i, dueRemaining: i.dueRemaining + pay.amount } : i);
        return { ...prev, invoices };
      });
    }

    repo.deletePayment(Number(paymentId))
      .then(() => load()) // el back ajusta balance al borrar el pago; recarga
      .catch(() => {
        // revertir: volvemos a insertar el pago
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

  return {
    credit,
    hasCredit,
    create,
    addInvoice,
    removeInvoice,
    payInvoice,
    removePayment,
    cancelInvoice,
    removeCredit,
    loading,
    errorMsg,
  };
}
