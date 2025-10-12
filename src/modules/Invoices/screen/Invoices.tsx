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
import { useProfile } from "../../Profile/hooks/useProfile";
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
  const [isCashRegisterOpen, setIsCashRegisterOpen] = useState(false);

  
  const [paymentMethod, setPaymentMethod] = useState<string>("Efectivo");
  const [initialCreditPayment, setInitialCreditPayment] = useState<string>("");
  const { submitting, submit, mapItemsToPayload, error } = useSubmitInvoice();
  const { invoices, loading: loadingHistory, error: errorHistory, refetch } = useInvoiceHistory();

  const { profiles, loading: loadingProfiles } = useProfile();
  const employees = profiles.filter(
    (p) => p.role?.name?.toLowerCase?.() === "empleado" || p.role?.name?.toLowerCase?.() === "employee" || p.role_id === 2
  );
  const [seller, setSeller] = useState<string>("");

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<TInvoiceEndpoint | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">("info");
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const showAlert = (title: string, message: string, type: "success" | "error" | "info" = "info") => {
    setAlertTitle(title);
    setAlertMsg(message);
    setAlertType(type);
    setAlertOpen(true);
  };

  const handleToggleCashRegister = () => {
    setIsCashRegisterOpen(!isCashRegisterOpen);
    setConfirmationModalOpen(false);
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
              <div className={`text-sm font-medium ${isCashRegisterOpen ? 'text-green-600' : 'text-red-600'}`}>
                Caja: {isCashRegisterOpen ? 'Abierta' : 'Cerrada'}
              </div>
            </div>
            <button
              className={`w-auto border rounded-3xl py-2 px-5 font-Lato text-base transition duration-300 ${
                isCashRegisterOpen
                  ? 'bg-red-500 hover:bg-red-800 text-white'
                  : 'bg-green-500 hover:bg-green-800 text-white'
              }`}
              onClick={() => setConfirmationModalOpen(true)}
            >
              {isCashRegisterOpen ? 'Cerrar caja' : 'Abrir caja'}
            </button>
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
              disabled={!isCashRegisterOpen}
            >
              Agregar productos
            </button>
            <button
              className="w-auto border rounded-3xl py-2 px-5 font-Lato text-base bg-white border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                submitting ||
                !selectedClient ||
                items.length === 0 ||
                !isCashRegisterOpen
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
              const payload = {
                customer_id: selectedClient.id,
                issue_date: issueNow,
                payment_method: method,
                products: mapItemsToPayload(items.map((i) => ({ product_id: i.product_id, qty: i.qty })) ),
                status: statusForMethod,
                cash_register_id: 1,
                user_id: 2
              } as const;
              console.log('[Invoice Submit] payload', payload);
              await submit(payload);
              showAlert("Factura creada", "La factura fue creada correctamente", "success");

                  setPaymentMethod("Efectivo");
                  clearItems();
                   
                  setQuery("");
                   
                  refetch();
                } catch (e) {
                  showAlert("Error", "No se pudo crear la factura", "error");
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
                disabled={!isCashRegisterOpen}
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
                placeholder="jose@test.com"
                value={selectedClient?.email ?? ""}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Vendedor</label>
              <select
                className={`w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 ${!isCashRegisterOpen ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                value={seller}
                onChange={(e) => setSeller(e.target.value)}
                disabled={loadingProfiles || !isCashRegisterOpen}
              >
                <option value="" disabled>
                  {loadingProfiles ? "Cargando vendedores…" : "Seleccione vendedor"}
                </option>
                {employees.map((u) => (
                  <option key={u.id} value={u.username}>
                    {u.username}
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
                className={`w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 ${!isCashRegisterOpen ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                disabled={!isCashRegisterOpen}
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Crédito">Crédito</option>
              </select>
            </div>
          </div>
        </div>

        {/* Items Table (dinámica) */}
        <InvoiceItemsTable
          items={items}
          onIncrease={increaseQty}
          onDecrease={decreaseQty}
          onRemove={removeItem}
          disabled={!isCashRegisterOpen}
        />

        {/* Totales */}
        <div className="bg-white rounded-md shadow-sm p-6">
          <div className="w-full md:w-80 ml-auto space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">TOTAL, $</span>
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
              <InvoiceHistoryTable
                data={invoices}
                onSelect={(inv) => {
                  setSelectedInvoice(inv);
                  setDetailOpen(true);
                }}
              />
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

      {/* Confirmation modal para abrir/cerrar caja */}
      <AlertModal
        open={confirmationModalOpen}
        title={isCashRegisterOpen ? "Cerrar caja" : "Abrir caja"}
        message={`¿Está seguro que desea ${isCashRegisterOpen ? 'cerrar' : 'abrir'} la caja?`}
        type="confirmation"
        onClose={() => setConfirmationModalOpen(false)}
        onConfirm={handleToggleCashRegister}
        confirmText={isCashRegisterOpen ? "Cerrar" : "Abrir"}
        cancelText="Cancelar"
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