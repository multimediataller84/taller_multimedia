import { useEffect, useMemo, useState } from "react";
import { reportsRepository, type InvoiceRow } from "../../Reports/repositories/reportsRepository";

export type TrendPoint = { name: string; value: number };
export type MonthInfo = { key: string; name: string; year: number; total: number };

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const monthShortEs = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export function useIncomeTrend() {
  const [months, setMonths] = useState<MonthInfo[]>([]);
  const [selectedMonthKey, setSelectedMonthKey] = useState<string>(() => monthKey(new Date()));
  const [dailyByMonth, setDailyByMonth] = useState<Record<string, Record<number, number>>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const invoices = await reportsRepository.getInvoices();
        const byMonth: Record<string, number> = {};
        const byMonthDay: Record<string, Record<number, number>> = {};

        for (const inv of invoices as InvoiceRow[]) {
          const dateStr = inv.createdAt || inv.issue_date || null;
          if (!dateStr) continue;
          const d = new Date(dateStr);
          if (isNaN(d.getTime())) continue;
          const key = monthKey(d);
          const paid = Number(inv.amount_paid ?? inv.total ?? 0);
          const amt = Number.isFinite(paid) ? paid : 0;
          byMonth[key] = (byMonth[key] || 0) + amt;
          const day = d.getDate();
          if (!byMonthDay[key]) byMonthDay[key] = {};
          byMonthDay[key][day] = (byMonthDay[key][day] || 0) + amt;
        }

        // construir últimos 4 meses incluyendo actual
        const arr: MonthInfo[] = [];
        const now = new Date();
        for (let i = 3; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = monthKey(d);
          const name = monthShortEs[d.getMonth()];
          const total = Math.round(byMonth[key] || 0);
          arr.push({ key, name, year: d.getFullYear(), total });
        }
        setMonths(arr);
        setDailyByMonth(byMonthDay);
        if (!arr.find(m => m.key === selectedMonthKey)) {
          setSelectedMonthKey(monthKey(now));
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const selected = useMemo(() => months.find(m => m.key === selectedMonthKey) ?? months[months.length - 1], [months, selectedMonthKey]);
  const current = selected?.total ?? 0;

  const currentMonthName = selected?.name ?? monthShortEs[new Date().getMonth()];

  const currentYear = selected?.year ?? new Date().getFullYear();

  // Serie diaria del mes seleccionado
  const dailyPoints: TrendPoint[] = useMemo(() => {
    if (!selected) return [];
    const [y, m] = selected.key.split("-").map(Number);
    const daysInMonth = new Date(y, m!, 0).getDate();
    const byDay = dailyByMonth[selected.key] || {};
    const series: TrendPoint[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const label = String(day).padStart(2, "0");
      series.push({ name: label, value: Math.round(byDay[day] || 0) });
    }
    return series;
  }, [selected, dailyByMonth]);

  return { months, selectedMonthKey, setSelectedMonthKey, dailyPoints, loading, current, currentMonthName, currentYear };
}
