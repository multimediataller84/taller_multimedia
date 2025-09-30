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
  const { submitting, submit, mapItemsToPayload, error } = useSubmitInvoice();
  const { invoices, loading: loadingHistory, error: errorHistory, refetch } = useInvoiceHistory();

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
              disabled={submitting || !selectedClient || items.length === 0}
              onClick={async () => {
                if (!selectedClient) return;
                try {
                  const paymentMap: Record<string, string> = {
                    Efectivo: "Cash",
                    Tarjeta: "Card",
                    Transferencia: "Transfer",
                  };
                  if (items.length === 0) {
                    alert("Debe agregar al menos un producto");
                    return;
                  }
                  const issueNow = new Date().toISOString();
                  const payload = {
                    customer_id: selectedClient.id,
                    issue_date: issueNow,
                    payment_method: paymentMap[paymentMethod] ?? paymentMethod,
                    products: mapItemsToPayload(items.map((i) => ({ product_id: i.product_id, qty: i.qty })) ),
                    status: "Issued",
                  } as const;
                  console.log('[Invoice Submit] payload', payload);
                  await submit(payload);
                  alert("Factura creada correctamente");
                  
                  setPaymentMethod("Efectivo");
                  clearItems();
                  
                  setQuery("");
                  setSelectedClient(null);
                  
                  refetch();
                } catch (e) {
                  alert("No se pudo crear la factura");
                }
              }}
            >
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
              <InvoiceHistoryTable data={invoices} />
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
    </RootLayout>
  );
};
