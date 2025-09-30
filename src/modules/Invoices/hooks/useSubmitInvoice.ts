import { useState } from "react";
import type { AxiosError } from "axios";
import { InvoiceService } from "../services/invoiceService";
import type { TInvoice, TInvoiceProduct } from "../models/types/TInvoice";
import type { TInvoiceEndpoint } from "../models/types/TInvoiceEndpoint";

const service = InvoiceService.getInstance();

export const useSubmitInvoice = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TInvoiceEndpoint | null>(null);

  const submit = async (payload: TInvoice) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await service.post(payload);
      setResult(res);
      return res;
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

  const mapItemsToPayload = (items: { product_id: number; qty: number }[]): TInvoiceProduct[] =>
    items.map((i) => ({ id: i.product_id, quantity: i.qty }));

  return { submitting, error, result, submit, mapItemsToPayload };
};
