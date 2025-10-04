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
import { creditRepository } from "../../Credit/repositories/creditRepository";

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
  const [initialCreditPayment, setInitialCreditPayment] = useState<string>("");
  const { submitting, submit, mapItemsToPayload, error } = useSubmitInvoice();
  const { invoices, loading: loadingHistory, error: errorHistory, refetch } = useInvoiceHistory();

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

  return (
    <RootLayout search={search} setSearch={setSearch}>
      <div className="flex-1 bg-[#DEE8ED] w-full h-screen p-8 space-y-4">
        {/* Tabs - justo debajo de la navbar */}
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
          <h2 className="font-Lato text-2xl">Facturas</h2>
          <div className="flex items-center gap-3">
            <button
              className="w-auto border rounded-3xl py-2 px-5 font-Lato text-base transition duration-300 bg-blue-500 hover:bg-blue-800 text-white"
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
                (paymentMethod === "Crédito" && (
                  initialCreditPayment.trim() === "" ||
                  Number(initialCreditPayment) <= 0 ||
                  Number.isNaN(Number(initialCreditPayment)) ||
                  Number(initialCreditPayment) > subtotal
                ))
              }
              onClick={async () => {
                if (!selectedClient) return;
                try {
                  const paymentMap: Record<string, string> = {
                    Efectivo: "Cash",
                    Tarjeta: "Card",
                    Transferencia: "Transfer",
                    "Crédito": "Credit",
                  };
                  if (items.length === 0) {
                    showAlert("Acción requerida", "Debe agregar al menos un producto", "error");
                    return;
                  }
                  const issueNow = new Date().toISOString();
                  const isCredit = paymentMethod === "Crédito";
                  const initialPaid = isCredit ? Number(initialCreditPayment) : 0;
                  if (isCredit) {
                    if (initialCreditPayment.trim() === "") {
                      showAlert("Pago inicial requerido", "Ingrese un monto de pago inicial para usar Crédito.", "error");
                      return;
                    }
                    if (Number.isNaN(initialPaid) || initialPaid <= 0) {
                      showAlert("Monto inválido", "El pago inicial debe ser un número válido mayor que 0", "error");
                      return;
                    }
                    if (initialPaid > subtotal) {
                      showAlert("Monto inválido", "El pago inicial no puede ser mayor que el total", "error");
                      return;
                    }
                  }
                  const payload = {
                    customer_id: selectedClient.id,
                    issue_date: issueNow,
                    payment_method: paymentMap[paymentMethod] ?? paymentMethod,
                    products: mapItemsToPayload(items.map((i) => ({ product_id: i.product_id, qty: i.qty })) ),
                    status: "Issued",
                  } as const;
                  console.log('[Invoice Submit] payload', payload);
                  const created = await submit(payload);
                  if (isCredit && initialPaid > 0) {
                    try {
                      const backCredit = await creditRepository.getCreditByCustomer(selectedClient.id);
                      if (!backCredit) {
                        showAlert("Crédito no encontrado", "El cliente no tiene una línea de crédito asignada.", "error");
                        return;
                      }
                      await creditRepository.createPayment({
                        credit_id: backCredit.id,
                        amount: initialPaid,
                        payment_method: "Credit",
                        invoice_id: created.id,
                      });
                    } catch (payErr) {
                      showAlert("Error", "La factura se creó, pero no se pudo registrar el pago inicial en crédito.", "error");
                    }
                  }
                  showAlert("Factura creada", "La factura fue creada correctamente", "success");
                  
                  setPaymentMethod("Efectivo");
                  setInitialCreditPayment("");
                  clearItems();
                   
                  setQuery("");
                  setSelectedClient(null);
                   
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
              <select className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400">
                <option>Obed Alvarado</option>
                <option>Otro</option>
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
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Crédito">Crédito</option>
              </select>
              {paymentMethod === "Crédito" && (
                <div className="mt-2">
                  <label className="block text-sm text-gray-600 mb-1">Pago inicial (opcional)</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={initialCreditPayment}
                    onChange={(e) => setInitialCreditPayment(e.target.value)}
                    placeholder="0.00"
                    className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">No puede exceder el total actual.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Table (dinámica) */}
        <InvoiceItemsTable
          items={items}
          onIncrease={increaseQty}
          onDecrease={decreaseQty}
          onRemove={removeItem}
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
    </RootLayout>
  );
};
