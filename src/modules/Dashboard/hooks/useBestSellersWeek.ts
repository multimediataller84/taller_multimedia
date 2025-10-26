import { useEffect, useMemo, useState } from "react";
import { reportsRepository } from "../../Reports/repositories/reportsRepository";
import { parseDateLoose } from "../../Reports/utils/reporting";

export type BestSeller = { id: number; name: string; qty: number };

function isWithinLastDays(dateStr?: string, days = 7) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
}

function readThroughQty(prod: unknown): number {
  if (!prod || typeof prod !== "object") return 0;
  const rec = prod as Record<string, unknown> & { InvoiceProduct?: { quantity?: unknown } };
  if (rec.InvoiceProduct && typeof rec.InvoiceProduct === "object") {
    return Number(rec.InvoiceProduct.quantity ?? 0);
  }
  const k = Object.keys(rec).find((key) => {
    const v = (rec as Record<string, unknown>)[key];
    return /invoice.*product/i.test(key) && typeof v === "object" && v !== null;
  });
  if (k) {
    const t = (rec as Record<string, unknown>)[k] as Record<string, unknown>;
    const q = (t.quantity as unknown) ?? (t.qty as unknown) ?? (t.Quantity as unknown) ?? 0;
    return Number(q);
  }
  return 0;
}

function readId(prod: unknown): number {
  if (!prod || typeof prod !== "object") return 0;
  const rec = prod as Record<string, unknown>;
  const id = Number((rec.id as unknown) ?? (rec.product_id as unknown) ?? 0);
  return Number.isFinite(id) ? id : 0;
}

function readName(prod: unknown, id: number): string {
  if (!prod || typeof prod !== "object") return `#${id}`;
  const rec = prod as Record<string, unknown>;
  return String((rec.product_name as unknown) ?? (rec.name as unknown) ?? `#${id}`);
}

export function useBestSellersWeek(limit = 5) {
  const [data, setData] = useState<BestSeller[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const invoices = await reportsRepository.getInvoices();

        const byProduct = new Map<number, { id: number; name: string; qty: number }>();
        type InvoiceLike = { createdAt?: string; issue_date?: string; products?: unknown[] };
        for (const inv of invoices ?? []) {
          const invR = inv as unknown as InvoiceLike;
          const when = parseDateLoose(invR.createdAt ?? invR.issue_date);
          if (!when || !isWithinLastDays(when.toISOString(), 7)) continue;
          const lines: unknown[] = invR.products ?? [];
          for (const p of lines) {
            const qty = readThroughQty(p);
            if (!qty) continue;
            const id = readId(p);
            const name = readName(p, id);
            const prev = byProduct.get(id);
            if (prev) prev.qty += qty; else byProduct.set(id, { id, name, qty });
          }
        }

        const rows: BestSeller[] = Array.from(byProduct.values())
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
