import { useEffect, useMemo, useState } from "react";
import { InvoiceService } from "../../Invoices/services/invoiceService";
import { ProductRepository } from "../../Product/repositories/productRepository";
import { UseCasesController } from "../../Product/controllers/useCasesController";
import type { TInvoiceEndpoint } from "../../Invoices/models/types/TInvoiceEndpoint";
import type { TProductEndpoint } from "../../Product/models/types/TProductEndpoint";

const invoiceService = InvoiceService.getInstance();
const productRepo = ProductRepository.getInstance();
const productUseCases = new UseCasesController(productRepo);

export type BestSeller = { id: number; name: string; qty: number };

function isWithinLastDays(dateStr?: string, days = 7) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
}

export function useBestSellersWeek(limit = 5) {
  const [data, setData] = useState<BestSeller[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [invoices, prodRes] = await Promise.all([
          invoiceService.getAll(),
          productUseCases.getAll.execute({ limit: 1000, offset: 0, orderDirection: "ASC" }),
        ]);

        const products: TProductEndpoint[] = (prodRes.data ?? []) as TProductEndpoint[];
        const nameById = new Map(products.map(p => [p.id, p.product_name] as const));

        const recentInvoices = (invoices ?? []).filter((inv: TInvoiceEndpoint) =>
          isWithinLastDays(inv.createdAt || inv.issue_date || undefined, 7)
        );

        const byProduct: Record<number, number> = {};
        for (const inv of recentInvoices) {
          const lines = (inv.products ?? []) as Array<{ id?: number; product_id?: number; quantity?: number }>;
          for (const line of lines) {
            const pid = Number((line.id ?? line.product_id) as number | undefined);
            const qty = Number((line.quantity ?? 0) as number | undefined);
            if (!Number.isFinite(pid) || !Number.isFinite(qty)) continue;
            byProduct[pid] = (byProduct[pid] || 0) + qty;
          }
        }

        const rows: BestSeller[] = Object.entries(byProduct)
          .map(([idStr, qty]) => ({
            id: Number(idStr),
            name: nameById.get(Number(idStr)) || `#${idStr}`,
            qty: Number(qty),
          }))
          .sort((a, b) => b.qty - a.qty)
          .slice(0, limit);

        setData(rows);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [limit]);

  const maxQty = useMemo(() => data.reduce((m, r) => Math.max(m, r.qty), 0), [data]);

  return { data, loading, maxQty };
}
