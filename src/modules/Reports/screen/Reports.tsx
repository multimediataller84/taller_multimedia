import { useEffect, useMemo, useState } from "react";
import { reportsRepository, InvoiceRow, CreditPaymentRow } from "../repositories/reportsRepository";
import {
  crc,
  DateRangeKey,
  parseDateLoose,
  startOfDay,
  endOfDay,
  inRange,
  paginate,
  buildPageList,
} from "../utils/reporting";

type TabKey = "sales" | "products" | "customers" | "credits";

const PAGE_SIZE_DEFAULT = 10;

export const Reports = ({search}: {search : string}) => {
  const [rangeKey, setRangeKey] = useState<DateRangeKey>("today");
  const [from, setFrom] = useState<Date>(() => startOfDay(new Date()));
  const [to, setTo] = useState<Date>(() => endOfDay(new Date()));
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [payments, setPayments] = useState<CreditPaymentRow[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("sales");

  const [pageSales, setPageSales] = useState(1);
  const [pageCredits, setPageCredits] = useState(1);
  const [pageProducts, setPageProducts] = useState(1);
  const [pageCustomers, setPageCustomers] = useState(1);

  const [pageSize] = useState(PAGE_SIZE_DEFAULT);

  useEffect(() => {
    setPageSales(1);
    setPageCredits(1);
    setPageProducts(1);
    setPageCustomers(1);
  }, [from, to, search, activeTab]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [inv, pays] = await Promise.all([
          reportsRepository.getInvoices(),
          reportsRepository.getCreditPayments(),
        ]);
        setInvoices(inv);
        setPayments(pays);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const now = new Date();
    if (rangeKey === "today") {
      setFrom(startOfDay(now));
      setTo(endOfDay(now));
    } else if (rangeKey === "yesterday") {
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      setFrom(startOfDay(y));
      setTo(endOfDay(y));
    } else if (rangeKey === "last7") {
      const s = new Date(now);
      s.setDate(s.getDate() - 6);
      setFrom(startOfDay(s));
      setTo(endOfDay(now));
    } else if (rangeKey === "month") {
      const s = new Date(now.getFullYear(), now.getMonth(), 1);
      const e = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      setFrom(startOfDay(s));
      setTo(endOfDay(e));
    }
  }, [rangeKey]);

  const filteredInvoices = useMemo(() => {
    const q = search.trim().toLowerCase();
    return invoices.filter((inv) => {
      const when = parseDateLoose(inv.createdAt ?? inv.issue_date);
      const okDate = inRange(when, from, to);
      if (!okDate) return false;
      if (!q) return true;
      const cname = `${inv.customer?.name ?? ""} ${inv.customer?.last_name ?? ""}`.toLowerCase();
      return (
        cname.includes(q) ||
        String(inv.invoice_number ?? "").toLowerCase().includes(q)
      );
    });
  }, [invoices, from, to, search]);

  const creditPaymentsInRange = useMemo(() => {
    return payments.filter((p) =>
      inRange(
        parseDateLoose(p.createdAt) ?? parseDateLoose(p.payment_date),
        from,
        to
      )
    );
  }, [payments, from, to]);

  const kpisSales = useMemo(() => {
    const total = filteredInvoices.reduce((s, r) => s + Number(r.total || 0), 0);

    const byMethod = filteredInvoices.reduce<Record<string, number>>((acc, r) => {
      const k = r.payment_method || "N/A";
      acc[k] = (acc[k] || 0) + Number(r.total || 0);
      return acc;
    }, {});

    const nonCreditPaid = filteredInvoices
      .filter(r => String(r.payment_method).toLowerCase() !== "credit")
      .reduce((s, r) => s + Number(r.total || 0), 0);

    const creditAbonosInRange = creditPaymentsInRange.reduce((s, p) => s + Number(p.amount || 0), 0);

    const paid = nonCreditPaid + creditAbonosInRange;
    const pending = Math.max(0, total - paid);
    const count = filteredInvoices.length;

    return { total, paid, pending, count, byMethod };
  }, [filteredInvoices, creditPaymentsInRange]);

  const allCreditInvoices = useMemo(
    () => invoices.filter(r => String(r.payment_method).toLowerCase() === "credit"),
    [invoices]
  );
  const creditInvoicesTotalAll = useMemo(
    () => allCreditInvoices.reduce((s, r) => s + Number(r.total || 0), 0),
    [allCreditInvoices]
  );

  const creditPaymentsTotalAll = useMemo(
    () => payments.reduce((s, p) => s + Number(p.amount || 0), 0),
    [payments]
  );

  const creditOutstandingGlobal = useMemo(
    () => Math.max(0, creditInvoicesTotalAll - creditPaymentsTotalAll),
    [creditInvoicesTotalAll, creditPaymentsTotalAll]
  );

  const kpisCredits = useMemo(() => {
    const total = creditInvoicesTotalAll;
    const paid = creditPaymentsInRange.reduce((s, p) => s + Number(p.amount || 0), 0);
    const pending = creditOutstandingGlobal;
    const count = creditPaymentsInRange.length;
    const byMethod = { Credit: total };
    return { total, paid, pending, count, byMethod };
  }, [creditInvoicesTotalAll, creditOutstandingGlobal, creditPaymentsInRange]);

  type ProductAgg = { id: number; name: string; sku: string; qty: number };

  function readThroughQty(prod: any): number {
    if (!prod || typeof prod !== "object") return 0;

    if (prod.InvoiceProduct && typeof prod.InvoiceProduct === "object") {
      return Number(prod.InvoiceProduct.quantity ?? 0);
    }

    const k = Object.keys(prod).find((key) =>
      /invoice.*product/i.test(key) && typeof (prod as any)[key] === "object"
    );
    if (k) {
      const t = (prod as any)[k];
      return Number(t?.quantity ?? t?.qty ?? t?.Quantity ?? 0);
    }

    return 0;
  }

  const productRanking = useMemo<ProductAgg[]>(() => {
    const acc = new Map<number, ProductAgg>();

    for (const inv of filteredInvoices) {
      const prods: any[] = (inv as any).products ?? [];
      for (const p of prods) {
        const qty = readThroughQty(p);
        if (!qty) continue;

        const id = Number(p.id);
        const prev = acc.get(id);
        if (prev) {
          prev.qty += qty;
        } else {
          acc.set(id, {
            id,
            name: String(p.product_name ?? p.name ?? `#${id}`),
            sku: String(p.sku ?? ""),
            qty,
          });
        }
      }
    }

    return Array.from(acc.values()).sort((a, b) => b.qty - a.qty);
  }, [filteredInvoices]);

  type CustomerAgg = { id: number; name: string; total: number, invoices: number };
  const customerRanking = useMemo<CustomerAgg[]>(() => {
    const acc = new Map<number, CustomerAgg>();
    for (const inv of filteredInvoices) {
      const cid = Number(inv.customer_id);
      const name = `${inv.customer?.name ?? ""} ${inv.customer?.last_name ?? ""}`.trim() || `#${cid}`;
      const amt = Number(inv.total ?? 0);
      const prev = acc.get(cid);
      if (prev) {
        prev.total += amt;
        prev.invoices += 1;
      } else {
        acc.set(cid, { id: cid, name, total: amt, invoices: 1 });
      }
    }
    return Array.from(acc.values()).sort((a, b) => b.total - a.total);
  }, [filteredInvoices]);

  const salesPageData = paginate(filteredInvoices, pageSales, pageSize);
  const creditsPageData = paginate(creditPaymentsInRange, pageCredits, pageSize);
  const productsPageData = paginate(productRanking, pageProducts, pageSize);
  const customersPageData = paginate(customerRanking, pageCustomers, pageSize);

  return (
    
      <div className="flex-1 p-6 w-full">
        <h1 className="text-2xl font-semibold mb-4">Reportes</h1>

        <div className="bg-white rounded-2xl p-4 border border-gray-200 mb-4 flex flex-wrap gap-3 items-center">
          <div className="flex gap-2">
            <label className="text-sm">Rango:</label>
            <select
              className="h-9 rounded-xl border border-gray2 px-3"
              value={rangeKey}
              onChange={(e) => setRangeKey(e.target.value as DateRangeKey)}
            >
              <option value="today">Hoy</option>
              <option value="yesterday">Ayer</option>
              <option value="last7">Últimos 7 días</option>
              <option value="month">Este mes</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          <div className="flex gap-2 items-center">
            <label className="text-sm">Desde:</label>
            <input
              type="date"
              className="h-9 rounded-xl border border-gray2 px-3"
              disabled={rangeKey !== "custom"}
              value={from.toISOString().slice(0, 10)}
              onChange={(e) => setFrom(startOfDay(new Date(e.target.value)))}
            />
          </div>

          <div className="flex gap-2 items-center">
            <label className="text-sm">Hasta:</label>
            <input
              type="date"
              className="h-9 rounded-xl border border-gray2 px-3"
              disabled={rangeKey !== "custom"}
              value={to.toISOString().slice(0, 10)}
              onChange={(e) => setTo(endOfDay(new Date(e.target.value)))}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          {activeTab === "sales" && (
            <>
              <KpiCard title="Ventas" value={crc(kpisSales.total)} />
              <KpiCard title="Pagado" value={crc(kpisSales.paid)} />
              <KpiCard title="Facturas" value={kpisSales.count} />
            </>
          )}

          {activeTab === "credits" && (
            <>
              <KpiCard title="Crédito (total)" value={crc(kpisCredits.total)} />
              <KpiCard title="Pagado" value={crc(kpisCredits.paid)} />
              <KpiCard title="Pendiente" value={crc(kpisCredits.pending)} />
              <KpiCard title="Abonos" value={kpisCredits.count} />
            </>
          )}

          {activeTab === "products" && (
            <>
              <KpiCard title="Ventas" value={crc(kpisSales.total)} />
            </>
          )}

          {activeTab === "customers" && (
            <>
              <KpiCard title="Ventas" value={crc(kpisSales.total)} />
              <KpiCard title="Facturas" value={kpisSales.count} />
            </>
          )}
        </div>

        <div className="flex gap-2 mb-3">
          {(["sales", "credits", "products", "customers"] as TabKey[]).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-3xl border ${
                t === activeTab ? "bg-blue-500 text-white border-blue-500" : "bg-black text-white"
              }`}
            >
              {{
                sales: "Ventas",
                credits: "Créditos",
                products: "Productos",
                customers: "Clientes",
              }[t]}
            </button>
          ))}
        </div>

        {activeTab === "sales" && (
          <>
            <div className="flex gap-3 mb-3 flex-wrap">
              {Object.entries(kpisSales.byMethod).map(([m, v]) => (
                <div key={m} className="px-4 py-1.5 rounded-3xl bg-white border border-gray-200">
                  <span className="text-sm font-medium">{m}:</span>{" "}
                  <span className="font-semibold">{crc(v)}</span>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-white border-b border-gray-200">
                  <tr className="text-left">
                    <Th>#</Th>
                    <Th>Fecha</Th>
                    <Th>Cliente</Th>
                    <Th>Método</Th>
                    <Th>Subtotal</Th>
                    <Th>Total</Th>
                    <Th>Pagado</Th>
                    <Th>Pendiente</Th>
                    <Th>Estado</Th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-black">
                  {loading && (
                    <tr>
                      <td colSpan={9} className="px-3 py-4 text-center">
                        Cargando…
                      </td>
                    </tr>
                  )}
                  {!loading && salesPageData.items.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-3 py-4 text-center text-gray-500">
                        Sin resultados
                      </td>
                    </tr>
                  )}
                  {!loading &&
                    salesPageData.items.map((r) => {
                      const when = parseDateLoose(r.createdAt ?? r.issue_date);
                      const whenTxt = when
                        ? when.toLocaleString("es-CR", { dateStyle: "short", timeStyle: "medium" })
                        : "-";
                      const cust =
                        `${r.customer?.name ?? ""} ${r.customer?.last_name ?? ""}`.trim() || "-";
                      const pending = Number(r.total || 0) - Number(r.amount_paid || 0);
                      return (
                        <tr key={r.id} className="hover:bg-gray-50/50">
                          <Td>{r.id}</Td>
                          <Td>{whenTxt}</Td>
                          <Td>{cust}</Td>
                          <Td>{r.payment_method}</Td>
                          <Td>{crc(Number(r.subtotal || 0))}</Td>
                          <Td>{crc(Number(r.total || 0))}</Td>
                          <Td>{crc(Number(r.amount_paid || 0))}</Td>
                          <Td>{crc(pending)}</Td>
                          <Td>{r.status}</Td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            <Pagination
              total={salesPageData.total}
              page={salesPageData.page}
              pageSize={salesPageData.pageSize}
              onPageChange={setPageSales}
            />
          </>
        )}

        {activeTab === "credits" && (
          <>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-white border-b border-gray-200">
                  <tr className="text-left">
                    <Th>#</Th>
                    <Th>Fecha</Th>
                    <Th>Factura</Th>
                    <Th>Monto</Th>
                    <Th>Método</Th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-black">
                  {creditsPageData.items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 text-center text-gray-500">
                        Sin resultados
                      </td>
                    </tr>
                  )}
                  {creditsPageData.items.map((p) => {
                    const d = parseDateLoose(p.createdAt) ?? parseDateLoose(p.payment_date);
                    const whenTxt = d
                      ? d.toLocaleString("es-CR", { dateStyle: "short", timeStyle: "medium" })
                      : "-";
                    return (
                      <tr key={p.id} className="hover:bg-gray-50/50">
                        <Td>{p.id}</Td>
                        <Td>{whenTxt}</Td>
                        <Td>{p.invoice_id}</Td>
                        <Td>{crc(p.amount)}</Td>
                        <Td>{p.payment_method}</Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Pagination
              total={creditsPageData.total}
              page={creditsPageData.page}
              pageSize={creditsPageData.pageSize}
              onPageChange={setPageCredits}
            />
          </>
        )}

        {activeTab === "products" && (
          <>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-white border-b border-gray-200">
                  <tr className="text-left">
                    <Th>#</Th>
                    <Th>Producto</Th>
                    <Th>SKU</Th>
                    <Th>Cantidad vendida</Th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-black">
                  {productsPageData.items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-3 py-4 text-center text-gray-500">
                        Sin resultados
                      </td>
                    </tr>
                  )}
                  {productsPageData.items.map((p, i) => (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <Td>{(productsPageData.page - 1) * productsPageData.pageSize + i + 1}</Td>
                      <Td>{p.name}</Td>
                      <Td>{p.sku || "-"}</Td>
                      <Td>{p.qty}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              total={productsPageData.total}
              page={productsPageData.page}
              pageSize={productsPageData.pageSize}
              onPageChange={setPageProducts}
            />
          </>
        )}

        {activeTab === "customers" && (
          <>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-white border-b border-gray-200">
                  <tr className="text-left">
                    <Th>#</Th>
                    <Th>Cliente</Th>
                    <Th>Facturas</Th>
                    <Th>Total facturado</Th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-black">
                  {customersPageData.items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-3 py-4 text-center text-gray-500">
                        Sin resultados
                      </td>
                    </tr>
                  )}
                  {customersPageData.items.map((c, i) => (
                    <tr key={c.id} className="hover:bg-gray-50/50">
                      <Td>{(customersPageData.page - 1) * customersPageData.pageSize + i + 1}</Td>
                      <Td>{c.name}</Td>
                      <Td>{c.invoices}</Td>
                      <Td>{crc(c.total)}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              total={customersPageData.total}
              page={customersPageData.page}
              pageSize={customersPageData.pageSize}
              onPageChange={setPageCustomers}
            />
          </>
        )}
      </div>
  );
};

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3">{children}</td>;
}

function KpiCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function Pagination({
  total,
  page,
  pageSize,
  onPageChange,
}: {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pages = buildPageList(page, totalPages);

  const btnBase =
    "w-8 h-8 rounded-full flex items-center justify-center border text-sm";
  const btnActive = "bg-blue-500 text-white border-blue-500";
  const btnMuted = "bg-white border-gray-300 hover:bg-gray-50";

  const go = (p: number) => {
    if (p < 1 || p > totalPages) return;
    onPageChange(p);
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <button className={`${btnBase} ${btnMuted}`} onClick={() => go(page - 1)}>
        ‹
      </button>
      {pages.map((p, idx) =>
        typeof p === "number" ? (
          <button
            key={`${p}-${idx}`}
            onClick={() => go(p)}
            className={`${btnBase} ${p === page ? btnActive : btnMuted}`}
          >
            {p}
          </button>
        ) : (
          <span key={`dots-${idx}`} className="px-2">
            …
          </span>
        )
      )}
      <button className={`${btnBase} ${btnMuted}`} onClick={() => go(page + 1)}>
        ›
      </button>
    </div>
  );
}

/*

<RootLayout search={search} setSearch={setSearch}>
*/