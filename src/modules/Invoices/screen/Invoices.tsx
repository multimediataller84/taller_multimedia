import { useState } from "react";
import { RootLayout } from "../../../_Layouts/RootLayout";
import { ClientSelector } from "../components/ClientSelector";
import { useInvoices } from "../hooks/useInvoices";
import { ProductPickerModal } from "../components/ProductPickerModal";
import { InvoiceItemsTable } from "../components/InvoiceItemsTable";
import { useInvoiceItems } from "../hooks/useInvoiceItems";
import { InvoiceTabs } from "../components/InvoiceTabs";
import type { TInvoiceTab } from "../models/types/TInvoiceTab";
import { useSubmitInvoice } from "../hooks/useSubmitInvoice";
import { useInvoiceHistory } from "../hooks/useInvoiceHistory";
import { InvoiceHistoryTable } from "../components/InvoiceHistoryTable";
import { InvoiceDetailModal } from "../components/InvoiceDetailModal";
import type { TInvoiceEndpoint } from "../models/types/TInvoiceEndpoint";
import { AlertModal } from "../components/AlertModal";
import type { TPaymentMethod } from "../models/types/TPaymentMethod";
import { useOpenRegisters } from "../hooks/useOpenRegisters";
import { useAiRecommendations } from "../hooks/useAiRecommendations";
import { ProductService } from "../../Product/services/productService";
import { InvoiceService } from "../services/invoiceService";
import type { TGetAllOptions } from "../../../models/types/TGetAllOptions";

export const Invoices = () => {
  const [search, setSearch] = useState("");
  const {
    query,
    setQuery,
    filteredClients,
    selectedClient,
    handleSelectClient,
    setSelectedClient,
  } = useInvoices();

  const {
    items,
    addProduct,
    increaseQty,
    decreaseQty,
    removeItem,
    subtotal,
    clearItems,
  } = useInvoiceItems();

  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TInvoiceTab>("generar");
  
  const [paymentMethod, setPaymentMethod] = useState<string>("Efectivo");
  const [paymentReceipt, setPaymentReceipt] = useState<string>("");

  const { submitting, submit, mapItemsToPayload, error } = useSubmitInvoice();
  const {
    currentInvoices,
    totalPages,
    activePage,
    setActivePage,
    pagesDisplay,
    canPrev,
    canNext,
    goPrev,
    goNext,
    loading: loadingHistory,
    error: errorHistory,
    refetch,
  } = useInvoiceHistory();

  const { registers, loading: loadingRegisters } = useOpenRegisters();
  const [seller, setSeller] = useState<string>(""); // value will be "userId:registerId"

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<TInvoiceEndpoint | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">("info");
  const showAlert = (title: string, message: string, type: "success" | "error" | "info" = "info") => {
    setAlertTitle(title);
    setAlertMsg(message);
    setAlertType(type);
    setAlertOpen(true);
  };


  const { loading: aiLoading, recs, error: aiError, generate, setRecs } = useAiRecommendations();
  const [openAiModal, setOpenAiModal] = useState(false);
  const todayISO = new Date().toLocaleDateString("sv-SE");


  function toISODate(d: string | Date | undefined) {
    if (!d) return "";
    try {
      const dt = new Date(d);
      return isNaN(dt.getTime()) ? "" : dt.toISOString().slice(0, 10);
    } catch {
      return "";
    }
  }

  function aggregateSalesToday(
  products: Array<{ id: number; product_name?: string; name?: string }>,
  invoicesToday: Array<TInvoiceEndpoint & { products?: any[]; items?: any[] }>
) {
  type Line = any;

  const byProduct: Record<number, number> = {};

  for (const inv of invoicesToday) {
    const lines: Line[] = (inv as any).products || (inv as any).items || [];
    for (const ln of lines) {

      const pid: number | undefined =
        (typeof ln.product_id === "number" && ln.product_id) ||
        (typeof ln.productId === "number" && ln.productId) ||
        (typeof ln.product?.id === "number" && ln.product.id) ||
        (typeof ln.Product?.id === "number" && ln.Product.id) ||
        (typeof ln.id === "number" && ln.id) ||
        undefined;

      if (typeof pid !== "number") continue;

      const q: number =
        (typeof ln.quantity === "number" && ln.quantity) ||
        (typeof ln.qty === "number" && ln.qty) ||
        (typeof ln.InvoiceProducts?.quantity === "number" && ln.InvoiceProducts.quantity) ||
        (typeof ln.invoice_products?.quantity === "number" && ln.invoice_products.quantity) ||
        (typeof ln.ProductsInvoices?.quantity === "number" && ln.ProductsInvoices.quantity) ||
        1;

      byProduct[pid] = (byProduct[pid] || 0) + q;
    }
  }

  const summary = products.map((p) => ({
    product_id: p.id,
    name: p.product_name ?? p.name ?? `Producto ${p.id}`,
    qty_today: byProduct[p.id] || 0,
  }));

  console.log("[AI] Ventas del día por producto:", summary);

  return { summary };
}

  async function handleAdviceClick() {
    try {
      const productSvc = ProductService.getInstance();
      const invoiceSvc = InvoiceService.getInstance();

      const productOptions: TGetAllOptions = {
        limit: 1000,
        offset: 0,
        orderDirection: "ASC",
      };
      const prodPage = await productSvc.getAll(productOptions);
      const products: Array<{ id: number; product_name?: string; name?: string }> =
        (prodPage as any)?.data ?? (prodPage as any)?.rows ?? [];

      const allInvoices = await invoiceSvc.getAll();
      const invoicesToday = allInvoices.filter((inv) => {
        const d =
          toISODate((inv as any).issue_date) ||
          toISODate((inv as any).createdAt) ||
          toISODate((inv as any).updatedAt);
        return d === todayISO;
      });

      const { summary } = aggregateSalesToday(products, invoicesToday);

      const payload = {
        fecha: todayISO,
        products: products.map((p) => ({ id: p.id, name: p.product_name ?? p.name })),
        sales_today: summary,
      };

      await generate(payload);
      setOpenAiModal(true);
    } catch (e) {
      console.error(e);
      showAlert("Error", "No se pudieron cargar los datos de hoy para el análisis de IA.", "error");
    }
  }

  return (
    <RootLayout search={search} setSearch={setSearch}>
      <div className="flex-1 bg-[#DEE8ED] w-full h-screen p-8 space-y-4">
        <InvoiceTabs active={activeTab} onChange={setActiveTab} />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {activeTab === "generar" && (
          <>
        {/* Header acciones de generar */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h2 className="font-Lato text-2xl">Facturas</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
           <button
              className="w-auto border rounded-3xl py-2 px-5 font-Lato text-base transition duration-300 bg-blue-500 hover:bg-blue-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAdviceClick}
              disabled={aiLoading}
            >
              {aiLoading ? "Analizando…" : "Consejo de ventas IA"}
            </button>
          <button
            className="w-auto border rounded-3xl py-2 px-5 font-Lato text-base transition duration-300 bg-blue-500 hover:bg-blue-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setProductModalOpen(true)}
            
          >
            Agregar productos
          </button>
          <button
            className="w-auto border rounded-3xl py-2 px-5 font-Lato text-base bg-white border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              submitting ||
              !selectedClient ||
              items.length === 0 ||
              !seller
            }
            onClick={async () => {
            if (!selectedClient) return;
            try {
              const paymentMap: Record<string, TPaymentMethod> = {
                Efectivo: "Cash",
                Tarjeta: "Debit Card",
                Transferencia: "Transfer",
                "Crédito": "Credit",
              };
              if (items.length === 0) {
                showAlert("Acción requerida", "Debe agregar al menos un producto", "error");
                return;
              }
              const issueNow = new Date().toISOString();
              const method: TPaymentMethod = paymentMap[paymentMethod] ?? "Cash";
              const statusForMethod = method === "Credit" ? "Pending" : "Issued";
              const [selUserIdStr, selRegisterIdStr] = String(seller || "").split(":");
              const selUserId = Number(selUserIdStr);
              const selRegisterId = Number(selRegisterIdStr);
              if (!selUserId || !selRegisterId) {
                showAlert("Acción requerida", "Debe seleccionar un vendedor (usuario y caja abiertos)", "error");
                return;
              }
              if ((method === "Debit Card" || method === "Transfer") && (!paymentReceipt || paymentReceipt.trim().length === 0)) {
                showAlert("Acción requerida", "Debe ingresar el comprobante de pago para pagos con tarjeta o transferencia", "error");
                return;
              }
              const payload = {
                customer_id: selectedClient.id,
                issue_date: issueNow,
                payment_method: method,
                products: mapItemsToPayload(items.map((i) => ({ product_id: i.product_id, qty: i.qty })) ),
                status: statusForMethod,
                cash_register_id: selRegisterId,
                user_id: selUserId,
                payment_receipt: (method === "Debit Card" || method === "Transfer") && paymentReceipt ? paymentReceipt.trim() : undefined
              } as const;
              console.log('[Invoice Submit] payload', payload);
              await submit(payload);
              showAlert("Factura creada", "La factura fue creada correctamente", "success");

                setPaymentMethod("Efectivo");
                clearItems();
                 
                setQuery("");
                setSelectedClient(null);
                setPaymentReceipt("");
                 
                refetch();
              } catch (e) {
                let message = "No se pudo crear la factura";
                const err = e as unknown;
                if (typeof err === "string") {
                  message = err;
                } else if (err && typeof err === "object" && "response" in err) {
                  const resp = (err as { response?: { data?: { message?: string } } }).response;
                  const msg = resp?.data?.message;
                  if (typeof msg === "string" && msg.trim().length > 0) message = msg;
                } else if (err instanceof Error && err.message) {
                  message = err.message;
                }
                showAlert("Error al generar factura", String(message), "error");
              }
            }}>
            {submitting ? "Guardando…" : "Generar factura"}
          </button>
        </div>
      </div>
      {/* Customer / Invoice Details */}
      <div className="bg-white rounded-md p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Cliente</label>
              <ClientSelector
                query={query}
                setQuery={setQuery}
                filteredClients={filteredClients}
                onSelect={handleSelectClient}
                
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Teléfono</label>
              <input
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="502 7075-7888"
                value={selectedClient?.phone ?? ""}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="jose@correo.com"
                value={selectedClient?.email ?? ""}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Vendedor</label>
              <select
                className={`w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400`}
                value={seller}
                onChange={(e) => setSeller(e.target.value)}
                disabled={loadingRegisters}
              >
                <option value="" disabled>
                  {loadingRegisters ? "Cargando vendedores…" : "Seleccione vendedor"}
                </option>
                {registers.map((r) => (
                  <option key={r.id} value={`${r.user_id}:${r.id}`}>
                    {r.user?.name || r.user?.username || `Usuario ${r.user_id}`} (Caja #{r.id})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Fecha de emisión</label>
              <input
                className="w-full border rounded-md px-3 py-2 bg-gray-50 text-gray-600"
                value={new Date().toLocaleString()}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Pago</label>
              <select
                className={`w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400`}
                value={paymentMethod}
                onChange={(e) => {
                  const val = e.target.value;
                  setPaymentMethod(val);
                  if (val !== "Tarjeta" && val !== "Transferencia") {
                    setPaymentReceipt("");
                  }
                }}
                
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Transferencia">Transferencia/SINPE</option>
                <option value="Crédito">Crédito</option>
              </select>
            </div>
            {(paymentMethod === "Tarjeta" || paymentMethod === "Transferencia") && (
              <div>
                <label className="block text-sm text-gray-600 mb-1">Comprobante de pago</label>
                <input
                  className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Digite número o referencia del comprobante"
                  value={paymentReceipt}
                  onChange={(e) => setPaymentReceipt(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Items Table (dinámica) */}
        <InvoiceItemsTable
          items={items}
          onIncrease={increaseQty}
          onDecrease={decreaseQty}
          onRemove={removeItem}
          disabled={false}
        />

        {/* Totales */}
        <div className="bg-white rounded-md shadow-sm p-6">
          <div className="w-full md:w-80 ml-auto space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">TOTAL, ₡</span>
              <span className="font-semibold">{subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
          </>
        )}

        {activeTab === "historial" && (
          <div className="space-y-3">
            {errorHistory && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {errorHistory}
              </div>
            )}
            {loadingHistory ? (
              <div className="bg-white rounded-md p-6 shadow-sm">Cargando historial…</div>
            ) : (
              <>
                <InvoiceHistoryTable
                  data={currentInvoices}
                  onSelect={(inv) => {
                    setSelectedInvoice(inv);
                    setDetailOpen(true);
                  }}
                />

                {totalPages > 1 && (
                  <div className="mt-4 mb-2 pr-19 w-auto space-x-2 flex items-center font-Lato font-medium">
                    <button
                      className={`size-[36px] border rounded-full ${
                        canPrev ? "bg-white border-gray2 text-gray1" : "opacity-40 cursor-not-allowed bg-white border-gray2 text-gray1"
                      }`}
                      onClick={() => canPrev && goPrev()}
                      disabled={!canPrev}
                      aria-label="Anterior"
                    >
                      <div className="w-full justify-center flex">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 -translate-x-[1px]">
                          <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </button>
                    {pagesDisplay.map((p, idx) =>
                      typeof p === "number" ? (
                        <button
                          key={`${p}-${idx}`}
                          className={`size-[42px] border rounded-full active:outline-0 ${
                            activePage === p ? "bg-blue-500 text-white" : "bg-white border-gray2 text-gray1"
                          }`}
                          onClick={() => setActivePage(p)}
                        >
                          {p}
                        </button>
                      ) : (
                        <span key={`dots-${idx}`} className="px-2 text-gray-500">…</span>
                      )
                    )}
                    <button
                      className={`size-[36px] border rounded-full ${
                        canNext ? "bg-white border-gray2 text-gray1" : "opacity-40 cursor-not-allowed bg-white border-gray2 text-gray1"
                      }`}
                      onClick={() => canNext && goNext()}
                      disabled={!canNext}
                      aria-label="Siguiente"
                    >
                      <div className="w-full justify-center flex">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 translate-x-[1px]">
                          <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Modal de productos */}
      <ProductPickerModal
        isOpen={isProductModalOpen}
        onClose={() => setProductModalOpen(false)}
        onAdd={(p) => {
          addProduct(p);
        }}
      />

      {/* Modal detalle de factura */}
      <InvoiceDetailModal
        open={detailOpen}
        invoice={selectedInvoice}
        onClose={() => setDetailOpen(false)}
      />

      {/* Alert modal */}
      <AlertModal
        open={alertOpen}
        title={alertTitle}
        message={alertMsg}
        type={alertType}
        onClose={() => setAlertOpen(false)}
      />
      
      {openAiModal && (
        <div className="fixed inset-0 grid place-items-center bg-black/40 z-50">
          <div className="bg-white rounded-xl p-6 w-[540px] max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-2">Recomendaciones de hoy</h3>

            {aiError && (
              <div className="text-red-600 mb-2">No se pudo generar recomendaciones.</div>
            )}

            {!aiError && recs.length === 0 && (
              <div className="text-gray-500">No hay recomendaciones aún.</div>
            )}

            <div className="space-y-3">
              {recs.map((r, idx) => (
                <div key={idx} className="border rounded-lg p-3">
                  <div className="font-medium">{r.titulo}</div>
                  <div className="text-sm text-gray-700">{r.accion}</div>
                  {typeof r.confianza === "number" && (
                    <div className="text-xs text-gray-500 mt-1">
                      Confianza: {(r.confianza * 100).toFixed(0)}%
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 rounded-3xl bg-white border border-gray2 text-gray1"
                onClick={() => { setOpenAiModal(false); setRecs([]); }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </RootLayout>
  );
};