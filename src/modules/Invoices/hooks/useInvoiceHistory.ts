import { useEffect, useMemo, useState } from "react";
import { InvoiceService } from "../services/invoiceService";
import type { TInvoiceEndpoint } from "../models/types/TInvoiceEndpoint";

const service = InvoiceService.getInstance();

export const useInvoiceHistory = (search?: string) => {
  const [invoices, setInvoices] = useState<TInvoiceEndpoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<number>(1);
  const pageSize = 12;
  // Modo de paginación:
  // - "server": la API entrega solo la página solicitada (más eficiente con muchos datos)
  // - "client": se trae todo y se pagina/filtra en el navegador (comportamiento anterior)
  // - "unknown": aún no sabemos; intentamos primero en servidor y, si falla, caemos a cliente
  const [mode, setMode] = useState<"unknown" | "server" | "client">("unknown");
  const [serverTotal, setServerTotal] = useState<number | null>(null);
  // Controlador para cancelar peticiones previas si el usuario cambia rápido de búsqueda/página
  const [abortCtrl, setAbortCtrl] = useState<AbortController | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.getAll();
      setInvoices(data);
      setMode("client");
      setServerTotal(null);
    } catch (e) {
      setError("No se pudo cargar el historial de facturación");
    } finally {
      setLoading(false);
    }
  };

  // Intentamos pedir al servidor una página específica (page/limit/search).
  // Si la API no soporta esto o responde con error, hacemos fallback a traer todo (fetchAll).
  const fetchServerPage = async (page: number, q?: string) => {
    setLoading(true);
    setError(null);
    // Cancelamos la solicitud anterior para evitar mostrar datos desactualizados y ahorrar red
    abortCtrl?.abort();
    const ctrl = new AbortController();
    setAbortCtrl(ctrl);
    try {
      const res = await service.getPaged({ page, limit: pageSize, search: q?.trim() || undefined, signal: ctrl.signal });
      setInvoices(res.items);
      setServerTotal(res.total);
      setMode("server");
    } catch (_err) {
      // Fallback: no hay paginación de servidor, mantenemos la paginación en cliente
      await fetchAll();
    } finally {
      setLoading(false);
    }
  };


  // Carga inicial: probamos con paginación de servidor en la página 1
  useEffect(() => {
    fetchServerPage(1, search);
    setInitialized(true);
  }, []);

  // Cuando cambia la búsqueda:
  // - En "server": enviamos el texto al backend (con debounce de 300ms)
  // - En "client": filtramos localmente
  useEffect(() => {
    setActivePage(1);
    const timer = setTimeout(() => {
      if (mode === "server" || mode === "unknown") {
        fetchServerPage(1, search);
      } else {
        fetchAll();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const sorted = useMemo(() => {
    return [...invoices].sort((a, b) => {
      const da = new Date(a.issue_date ?? a.createdAt ?? 0).getTime();
      const db = new Date(b.issue_date ?? b.createdAt ?? 0).getTime();
      return db - da; 
    });
  }, [invoices]);

  const filtered = useMemo(() => {
    // En modo servidor el backend ya nos devuelve datos filtrados por "search"
    if (mode === "server") {
      return sorted;
    }
    const q = (search ?? "").toLowerCase().trim();
    if (!q) return sorted;
    return sorted.filter((inv) => {
      const c = inv.customer;
      const full = `${c?.name ?? ""} ${c?.last_name ?? ""} ${c?.id_number ?? ""}`.toLowerCase();
      return full.includes(q);
    });
  }, [sorted, search, mode]);

  // totalPages proviene del backend en modo "server" y del conteo local en modo "client"
  const total = mode === "server" && serverTotal != null ? serverTotal : filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(activePage, totalPages);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  // En "server" ya recibimos solo la página actual, así que no hacemos slice
  const currentInvoices = mode === "server" ? filtered : filtered.slice(start, end);

  // Si el usuario hace clic en otra página y estamos en "server", pedimos esa página a la API
  useEffect(() => {
    if (!initialized) return;
    if (mode === "server") {
      fetchServerPage(activePage, search);
    }
  }, [activePage]);

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
  const goPrev = () => {
    const next = Math.max(1, activePage - 1);
    setActivePage(next);
    // En modo servidor, también pedimos la página anterior al backend
    if (mode === "server") fetchServerPage(next, search);
  };
  const goNext = () => {
    const next = Math.min(totalPages, activePage + 1);
    setActivePage(next);
    // En modo servidor, también pedimos la página siguiente al backend
    if (mode === "server") fetchServerPage(next, search);
  };

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
    refetch: () => {
      // Refresca según el modo actual: servidor o cliente
      if (mode === "server") return fetchServerPage(activePage, search);
      return fetchAll();
    },
  };
};
