import { useState } from "react";
import type { AxiosError } from "axios";
import { InvoiceService } from "../services/invoiceService";
import type { TInvoice, TInvoiceProduct } from "../models/types/TInvoice";
import type { TInvoiceItem } from "../models/types/TInvoiceItem";

const service = InvoiceService.getInstance();

export const useSubmitInvoice = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (payload: TInvoice): Promise<void> => {
    setSubmitting(true);
    setError(null);
    try {
      await service.post(payload);
      return;
    } catch (e: unknown) {
      let message = 'Error al enviar factura';
      let status: number | undefined;
      if (e && typeof e === 'object') {
        const ax = e as AxiosError<{ message?: string }>;
        status = (ax.response?.status as number | undefined);
        const apiMsg = ax.response?.data?.message;
        if (apiMsg) message = apiMsg;
        else if (typeof ax.message === 'string') message = ax.message;
      }
      console.error('[Invoice Submit Error]', { status, message, raw: e });
      setError(message);
      throw e as Error;
    } finally {
      setSubmitting(false);
    }
  };

  const mapItemsToPayload = (items: TInvoiceItem[]): TInvoiceProduct[] =>
    items.map((i) => ({
      id: i.product_id,
      quantity: i.qty,
      unit_price: i.unit_price + i.profit_margin,
    }));

  return { submitting, error, submit, mapItemsToPayload };
};
