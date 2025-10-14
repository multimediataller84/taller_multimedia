export const crc = (n: number) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 2,
  }).format(n || 0);

export type DateRangeKey = "today" | "yesterday" | "last7" | "month" | "custom";

export function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
export function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
export function parseDateLoose(v?: string | Date | null): Date | null {
  if (!v) return null;
  if (v instanceof Date) return v;

  const asISO = v.length === 10 ? `${v}T00:00:00` : v;
  const d = new Date(asISO);
  return isNaN(d.getTime()) ? null : d;
}
export function inRange(d: Date | null, from: Date, to: Date) {
  if (!d) return false;
  return d.getTime() >= from.getTime() && d.getTime() <= to.getTime();
}

export function paginate<T>(rows: T[], page: number, pageSize: number) {
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = rows.slice(start, start + pageSize);
  return { items, page: safePage, pageSize, total, totalPages };
}

export function buildPageList(current: number, totalPages: number) {
  const pages: (number | string)[] = [];
  const push = (v: number | string) => pages.push(v);

  if (totalPages <= 7) {
    for (let p = 1; p <= totalPages; p++) push(p);
    return pages;
  }

  const left = Math.max(2, current - 1);
  const right = Math.min(totalPages - 1, current + 1);

  push(1);
  if (left > 2) push("dots-left");
  for (let p = left; p <= right; p++) push(p);
  if (right < totalPages - 1) push("dots-right");
  push(totalPages);

  if (!pages.includes(current)) {
    const idx = pages.indexOf("dots-left") >= 0 ? pages.indexOf("dots-left") + 1 : 1;
    pages.splice(idx, 0, current);
  }
  return pages.map((x) => (typeof x === "string" ? "…" : x));
}
