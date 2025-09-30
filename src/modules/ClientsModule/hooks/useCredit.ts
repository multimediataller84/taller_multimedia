// hooks/useCredit.ts
import { useCallback, useEffect, useState } from "react";
import { creditService } from "../services/creditService";
import type { TCredit, TCreditEndpoint, TCreditPayment, CreditSummary } from "../models/types/TCredit";

export const useCredit = (rawCustomerId?: number) => {
  const customerId = rawCustomerId ?? 0; // evita undefined en el inicio

  const [list, setList] = useState<TCreditEndpoint[]>([]);
  const [payments, setPayments] = useState<TCreditPayment[]>([]);
  const [summary, setSummary] = useState<CreditSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<any>(null);

  const refetch = useCallback(async () => {
    if (!customerId) return; // no hace nada hasta tener id válido
    setLoading(true);
    setErr(null);
    try {
      const rows = await creditService.listByCustomer(customerId);
      setList(rows);
      const s = await creditService.getSummary(customerId);
      setSummary(s);
      if (s?.creditId) {
        const ps = await creditService.listPayments(s.creditId);
        setPayments(ps);
      } else {
        setPayments([]);
      }
    } catch (e) {
      setErr(e);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // --- NOMBRES compatibles con editClient.tsx ---
  // requestCredit (alias) con la firma que espera el modal: { credit_amount, due_date }
  const request = async (payload: TCredit) => {
    if (!customerId) return;
    await creditService.request(customerId, payload);
    await refetch();
  };
  const requestCredit = request; // <-- alias para que no falle editClient.tsx

  const approve = async (creditId: number) => {
    await creditService.approve(creditId);
    await refetch();
  };

  const reject = async (creditId: number) => {
    await creditService.reject(creditId);
    await refetch();
  };

  const close = async (creditId: number) => {
    await creditService.close(creditId);
    await refetch();
  };

  // addPayment compatible con (creditId, amount)
  const addPayment = async (creditId: number, amount: number) => {
    await creditService.addPayment({ credit_id: creditId, amount });
    await refetch();
  };

  const deletePayment = async (paymentId: number) => {
    await creditService.deletePayment(paymentId);
    await refetch();
  };

  const loadPayments = async (creditId: number) => {
    const ps = await creditService.listPayments(creditId);
    setPayments(ps);
  };

  return {
    list,
    payments,
    summary,
    loading,
    err,
    refetch,
    request,
    requestCredit,
    approve,
    reject,
    close,
    addPayment,
    deletePayment,
    loadPayments,
  };
};
