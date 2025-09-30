import { useCallback, useEffect, useMemo, useState } from "react";
import { creditRepository } from "../repositories/creditRepository";
import type { TCredit } from "../models/types/TCredit";

export function useCredit(clientId: number | null) {
  const [credit, setCredit] = useState<TCredit | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (clientId == null) { setCredit(null); return; }
    setLoading(true);
    const c = creditRepository.getByClientId(clientId);
    setCredit(c);
    setLoading(false);
  }, [clientId]);

  const create = useCallback((amount: number) => {
    if (clientId == null) return null;
    const c = creditRepository.create({ clientId, amount });
    setCredit(c);
    setErrorMsg(null);
    return c;
  }, [clientId]);

  const addInvoice = useCallback((amount: number) => {
    if (clientId == null) return { ok: false, credit: null };
    const res = creditRepository.addInvoice(clientId, amount);
    if (res.credit) setCredit(res.credit);
    if (!res.ok) setErrorMsg("El monto excede el crédito disponible");
    else setErrorMsg(null);
    return res;
  }, [clientId]);

  const removeInvoice = useCallback((invoiceId: string) => {
    if (clientId == null) return null;
    const c = creditRepository.removeInvoice(clientId, invoiceId);
    if (c) setCredit(c);
    return c;
  }, [clientId]);

  const payInvoice = useCallback((invoiceId: string, amount: number) => {
    if (clientId == null) return { ok: false, credit: null };
    const res = creditRepository.payInvoice(clientId, invoiceId, amount);
    if (res.credit) setCredit(res.credit);
    if (!res.ok) setErrorMsg("El monto ingresado es inválido o excede el máximo permitido");
    else setErrorMsg(null);
    return res;
  }, [clientId]);

  const removePayment = useCallback((paymentId: string) => {
    if (clientId == null) return null;
    const c = creditRepository.removePayment(clientId, paymentId);
    if (c) setCredit(c);
    return c;
  }, [clientId]);

  const cancelInvoice = useCallback((invoiceId: string) => {
    if (clientId == null) return null;
    const c = creditRepository.cancelInvoice(clientId, invoiceId);
    if (c) setCredit(c);
    return c;
  }, [clientId]);

  const removeCredit = useCallback(() => {
    if (clientId == null) return;
    creditRepository.removeCredit(clientId);
    setCredit(null);
  }, [clientId]);

  const hasCredit = !!credit;

  const globalTopUpCap = useMemo(() => {
    if (!credit) return 0;
    return Math.max(0, credit.assigned - credit.remaining);
  }, [credit]);

  return {
    credit,
    loading,
    errorMsg,
    hasCredit,
    create,
    addInvoice,
    removeInvoice,
    payInvoice,
    removePayment,
    cancelInvoice,
    removeCredit,
    globalTopUpCap,
  };
}
