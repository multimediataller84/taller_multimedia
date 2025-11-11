import { useMemo } from "react";

export type TPaymentMethodLabel = "Efectivo" | "Tarjeta" | "Transferencia" | "Crédito" | string;

export const usePaymentTotals = (
  subtotal: number,
  paymentMethod: TPaymentMethodLabel,
  cashAmountInput: string,
  paymentReceipt: string
) => {
  const { totalToPay, changeDue, isCash, isCardOrTransfer, validCashAmount, hasRequiredReceipt, canSubmitPayment } = useMemo(() => {
    const isCash = paymentMethod === "Efectivo";
    const isCardOrTransfer = paymentMethod === "Tarjeta" || paymentMethod === "Transferencia";

    const parsedCash = Number(cashAmountInput);
    const cashAmount = Number.isFinite(parsedCash) ? parsedCash : NaN;

    const changeDue = isCash && Number.isFinite(cashAmount)
      ? Math.max(0, cashAmount - subtotal)
      : 0;

    const validCashAmount = !isCash || (Number.isFinite(cashAmount) && cashAmount >= subtotal);
    const hasRequiredReceipt = !isCardOrTransfer || (paymentReceipt?.trim().length ?? 0) > 0;

    return {
      totalToPay: subtotal,
      changeDue,
      isCash,
      isCardOrTransfer,
      validCashAmount,
      hasRequiredReceipt,
      canSubmitPayment: validCashAmount && hasRequiredReceipt,
    } as const;
  }, [subtotal, paymentMethod, cashAmountInput, paymentReceipt]);

  return { totalToPay, changeDue, isCash, isCardOrTransfer, validCashAmount, hasRequiredReceipt, canSubmitPayment } as const;
};
