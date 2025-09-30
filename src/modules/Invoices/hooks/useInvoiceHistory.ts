import { useEffect, useMemo, useState } from "react";
import { InvoiceService } from "../services/invoiceService";
import type { TInvoiceEndpoint } from "../models/types/TInvoiceEndpoint";

const service = InvoiceService.getInstance();

export const useInvoiceHistory = () => {
  const [invoices, setInvoices] = useState<TInvoiceEndpoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.getAll();
      setInvoices(data);
    } catch (e) {
      setError("No se pudo cargar el historial de facturación");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const sorted = useMemo(() => {
    return [...invoices].sort((a, b) => {
      const da = new Date(a.issue_date ?? a.createdAt ?? 0).getTime();
      const db = new Date(b.issue_date ?? b.createdAt ?? 0).getTime();
      return db - da; //más recientes primero
    });
  }, [invoices]);

  return { invoices: sorted, loading, error, refetch: fetchAll };
};
