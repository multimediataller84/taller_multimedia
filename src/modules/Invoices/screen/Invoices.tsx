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
  const [cashAmount, setCashAmount] = useState<string>("");

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
  } = useInvoiceHistory(activeTab === "historial" ? search : undefined);

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
    <RootLayout search={search} setSearch={setSearch} showSearch={activeTab === "historial"}>
      <div className="flex flex-col bg-gray3 w-[90%] h-full p-2 md:p-8 space-y-4">
        <InvoiceTabs active={activeTab} onChange={setActiveTab} />
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {activeTab === "generar" && (
          <>
        {/* Header acciones de generar */}
        <div className="flex items-center justify-between ">

          <div className="flex justify-end w-full items-center gap-3">

           <button
              className="hidden font-bold w-auto border rounded-3xl py-2 px-5 font-Lato text-xs sm:text-sm md:text-base transition duration-300 bg-black hover:bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAdviceClick}
              disabled={aiLoading}
            >
              {aiLoading ? "Analizando…" : "Consejo de ventas IA"}
            </button>

          <button
            className="font-bold w-auto border rounded-3xl py-2 px-5 font-Lato text-xs sm:text-sm md:text-base transition duration-300 border-blue-500 bg-blue-500 hover:bg-blue-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setProductModalOpen(true)}
            
          >
            Agregar productos
          </button>
          <button
            className="font-bold w-auto border rounded-3xl py-2 px-5 font-Lato text-xs sm:text-sm md:text-base disabled:bg-gray3 disabled:border-gray2 disabled:text-gray1 bg-blue-500 text-white border-blue-500 hover:bg-blue-800 hover:border-blue-800
            transition duration-300 disabled:cursor-not-allowed"
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
              if (method === "Cash") {
                const cashVal = Number(cashAmount);
                if (!isFinite(cashVal)) {
                  showAlert("Acción requerida", "Debe ingresar el monto entregado en efectivo", "error");
                  return;
                }
                if (cashVal < subtotal) {
                  showAlert(
                    "Monto insuficiente",
                    "El monto en efectivo no puede ser inferior al total de la factura",
                    "error"
                  );
                  return;
                }
              }
              if ((method === "Debit Card" || method === "Transfer") && (!paymentReceipt || paymentReceipt.trim().length === 0)) {
                showAlert("Acción requerida", "Debe ingresar el comprobante de pago para pagos con tarjeta o transferencia", "error");
                return;
              }
              const changeDue = method === "Cash" ? Math.max(0, Number(cashAmount) - subtotal) : 0;
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
              if (method === "Cash") {
                console.log('[Invoice Submit] cash_amount', Number(cashAmount), 'subtotal', subtotal, 'change_due', changeDue);
              }
              await submit(payload);
              const successMsg =
                method === "Cash" && changeDue > 0
                  ? `La factura fue creada correctamente. Vuelto: ₡${changeDue.toFixed(2)}`
                  : "La factura fue creada correctamente";
              showAlert("Factura creada", successMsg, "success");

                setPaymentMethod("Efectivo");
                clearItems();
                 
                setQuery("");
                setSelectedClient(null);
                setPaymentReceipt("");
                setCashAmount("");
                 
                refetch();
              } catch (e) {
                let message = "No se pudo crear la factura";
                const err = e as any;
                if (typeof err === "string") {
                  message = err;
                } else if (err && typeof err === "object" && "response" in err) {
                  const resp = err.response as { data?: any; statusText?: string } | undefined;
                  const data = resp?.data;
                  if (typeof data === "string" && data.trim().length > 0) {
                    message = data;
                  } else if (data && typeof data === "object") {
                    const candidates: Array<any> = [
                      data.error,
                      data.message,
                      Array.isArray(data.errors) ? data.errors.map((x: any) => x?.message || x).join("; ") : undefined,
                      Array.isArray(data) ? data.map((x: any) => x?.message || x).join("; ") : undefined,
                    ];
                    const found = candidates.find((c) => typeof c === "string" && c.trim().length > 0);
                    if (typeof found === "string") message = found;
                  }
                  if (message === "No se pudo crear la factura" && typeof resp?.statusText === "string" && resp.statusText.trim()) {
                    message = resp.statusText;
                  }
                } else if (err instanceof Error && err.message) {
                  message = err.message;
                }
                showAlert("Error al generar factura", String(message), "error");
              }
            }}>
            {submitting ? "Guardando…" : "Generar Factura"}
          </button>
        </div>
        
      </div>
      {/* Customer / Invoice Details */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
          {/* Cliente */}
          <div className="flex flex-col space-y-2 sm:space-y-4">
            <label className="text-sm sm:text-base text-black font-medium font-lato">Cliente</label>
            <ClientSelector
              query={query}
              setQuery={setQuery}
              filteredClients={filteredClients}
              onSelect={handleSelectClient}
            />
          </div>

          {/* Teléfono */}
          <div className="flex flex-col space-y-2 sm:space-y-4">
            <label className="text-sm sm:text-base text-black font-medium font-lato">Teléfono</label>
            <input
              className="w-full py-2 sm:py-2.5 border rounded-3xl px-3 sm:px-4 text-gray1 border-gray2 bg-white font-medium text-sm sm:text-base focus:outline-2 focus:outline-blue-500 font-Lato"
              placeholder="0000-0000"
              value={selectedClient?.phone ?? ""}
              readOnly
            />
          </div>

          {/* Email */}
          <div className="flex flex-col space-y-2 sm:space-y-4">
            <label className="text-sm sm:text-base text-black font-medium font-lato">Email</label>
            <input
              type="email"
              className="w-full py-2 sm:py-2.5 border rounded-3xl px-3 sm:px-4 text-gray1 border-gray2 bg-white font-medium text-sm sm:text-base focus:outline-2 focus:outline-blue-500 font-Lato"
              placeholder="correo@example.com"
              value={selectedClient?.email ?? ""}
              readOnly
            />
          </div>

          {/* Vendedor */}
          <div className="flex flex-col space-y-2 sm:space-y-4">
            <label className="text-sm sm:text-base text-black font-medium font-lato">Vendedor</label>
            <div className="relative">
              <select
                className="appearance-none w-full py-2 sm:py-2.5 border rounded-3xl px-3 sm:px-4 text-gray1 border-gray2 bg-white font-medium text-sm sm:text-base focus:outline-2 focus:outline-blue-500 font-Lato"
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
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"
                className="w-4 h-4 absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 fill-gray1">
                <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Fecha */}
          <div className="flex flex-col space-y-2 sm:space-y-4">
            <label className="text-sm sm:text-base text-black font-medium font-lato">Fecha de emisión</label>
            <div className="relative">
              <input
                className="appearance-none w-full py-2 sm:py-2.5 border rounded-3xl px-3 sm:px-4 text-gray1 border-gray2 bg-white font-medium text-sm sm:text-base focus:outline-2 focus:outline-blue-500 font-Lato"
                value={new Date().toLocaleString()}
                readOnly
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"
                className="w-4 h-4 absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 fill-gray1">
                <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Pago */}
          <div className="flex flex-col space-y-2 sm:space-y-4">
            <label className="text-sm sm:text-base text-black font-medium font-lato">Pago</label>
            <div className="relative">
              <select
                className="appearance-none w-full py-2 sm:py-2.5 border rounded-3xl px-3 sm:px-4 text-gray1 border-gray2 bg-white font-medium text-sm sm:text-base focus:outline-2 focus:outline-blue-500 font-Lato"
                value={paymentMethod}
                onChange={(e) => {
                  const val = e.target.value;
                  setPaymentMethod(val);
                  if (val !== "Tarjeta" && val !== "Transferencia") setPaymentReceipt("");
                  if (val !== "Efectivo") setCashAmount("");
                }}
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Transferencia">Transferencia/SINPE</option>
                <option value="Crédito">Crédito</option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"
                className="w-4 h-4 absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 fill-gray1">
                <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Efectivo o Transferencia */}
          {paymentMethod === "Efectivo" && (
            <div className="flex flex-col space-y-2 sm:space-y-4">
              <label className="text-sm sm:text-base text-black font-medium font-lato">Monto entregado</label>
              <input
                type="number"
                min={subtotal}
                step="0.01"
                className="w-full py-2 sm:py-2.5 border rounded-3xl px-3 sm:px-4 text-gray1 border-gray2 bg-white font-medium text-sm sm:text-base focus:outline-2 focus:outline-blue-500 font-Lato"
                placeholder="0.00"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
              />
            </div>
          )}

          {(paymentMethod === "Tarjeta" || paymentMethod === "Transferencia") && (
            <div className="flex flex-col space-y-2 sm:space-y-4">
              <label className="text-sm sm:text-base text-black font-medium font-lato">Comprobante de pago</label>
              <input
                className="w-full py-2 sm:py-2.5 border rounded-3xl px-3 sm:px-4 text-gray1 border-gray2 bg-white font-medium text-sm sm:text-base focus:outline-2 focus:outline-blue-500 font-Lato"
                placeholder="Digite número o referencia del comprobante"
                value={paymentReceipt}
                onChange={(e) => setPaymentReceipt(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

        {/* Totales */}
        <div className="bg-white rounded-2xl text-base font-medium shadow-sm p-4 sm:p-6 font-Lato">
          <div className="w-full md:w-80 ml-auto space-y-2 text-xl">
            <div className="flex justify-between">
              <span className="text-black font-Lato">TOTAL ₡</span>
              <span className="font-semibold">{subtotal.toFixed(2)}</span>
            </div>
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
                  <div className="mt-4 mb-2 pr-19 w-auto space-x-1 2xl:space-x-2 flex items-center font-Lato font-medium">
                    <button
                      className={`cursor-pointer size-6 2xl:size-9 rounded-full ${
                        canPrev ? "bg-white border-gray2 text-gray1" : "opacity-40 cursor-not-allowed bg-white border-gray2 text-gray1"
                      }`}
                      onClick={() => canPrev && goPrev()}
                      disabled={!canPrev}
                      aria-label="Anterior"
                    >
                      <div className="w-full justify-center flex">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                        className="size-3 2xl:size-4 -translate-x-[1px]">
                          <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </button>
                    {pagesDisplay.map((p, idx) =>
                      typeof p === "number" ? (
                        <button
                          key={`${p}-${idx}`}
                         className={`cursor-pointer size-9 2xl:size-[42px] border rounded-full active:outline-0 ${
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
                      className={`cursor-pointer size-6 2xl:size-9 border rounded-full transition  ${
                        canNext ? "bg-white border-gray2 text-gray1" : "opacity-40 cursor-not-allowed bg-white border-gray2 text-gray1"
                      }`}
                      onClick={() => canNext && goNext()}
                      disabled={!canNext}
                      aria-label="Siguiente"
                    >
                      <div className="w-full justify-center flex">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                        className="size-3 2xl:size-4 translate-x-[1px]">
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
                className="px-4 py-2 rounded-3xl bg-black border-black border text-white"
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