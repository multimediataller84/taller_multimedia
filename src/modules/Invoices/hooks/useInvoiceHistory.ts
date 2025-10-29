import { useEffect, useMemo, useState } from "react";
import { InvoiceService } from "../services/invoiceService";
import type { TInvoiceEndpoint } from "../models/types/TInvoiceEndpoint";

const service = InvoiceService.getInstance();

export const useInvoiceHistory = (search?: string) => {
  const [invoices, setInvoices] = useState<TInvoiceEndpoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Client-side pagination state
  const [activePage, setActivePage] = useState<number>(1);
  const pageSize = 12;

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
      return db - da; 
    });
  }, [invoices]);

  const filtered = useMemo(() => {
    const q = (search ?? "").toLowerCase().trim();
    if (!q) return sorted;
    return sorted.filter((inv) => {
      const c = inv.customer;
      const full = `${c?.name ?? ""} ${c?.last_name ?? ""} ${c?.id_number ?? ""}`.toLowerCase();
      return full.includes(q);
    });
  }, [sorted, search]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(activePage, totalPages);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const currentInvoices = filtered.slice(start, end);

  // Build condensed page buttons: [1, 2, 3, '...', N] with neighbors around active
  const pagesDisplay: Array<number | string> = (() => {
    const out: Array<number | string> = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) out.push(i);
      return out;
    }
    out.push(1);
    const windowStart = Math.max(2, page - 1);
    const windowEnd = Math.min(totalPages - 1, page + 1);
    if (windowStart > 2) out.push("...");
    for (let i = windowStart; i <= windowEnd; i++) out.push(i);
    if (windowEnd < totalPages - 1) out.push("...");
    out.push(totalPages);
    return out;
  })();

  const canPrev = page > 1;
  const canNext = page < totalPages;
  const goPrev = () => setActivePage((p) => Math.max(1, p - 1));
  const goNext = () => setActivePage((p) => Math.min(totalPages, p + 1));

  return {
    invoices: filtered,
    currentInvoices,
    totalPages,
    activePage,
    setActivePage,
    pagesDisplay,
    canPrev,
    canNext,
    goPrev,
    goNext,
    pageSize,
    loading,
    error,
    refetch: fetchAll,
  };
};
