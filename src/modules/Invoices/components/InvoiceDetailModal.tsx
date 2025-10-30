import React from "react";
import { useInvoiceDetail } from "../hooks/useInvoiceDetail";
import type { TInvoiceEndpoint } from "../models/types/TInvoiceEndpoint";
import { mapPaymentMethodToES, mapStatusToES } from "../utils/displayMappers";

interface Props {
  open: boolean;
  invoice: TInvoiceEndpoint | null;
  onClose: () => void;
}

export const InvoiceDetailModal: React.FC<Props> = ({ open, invoice, onClose }) => {
  const { data, loading, error, totals } = useInvoiceDetail(invoice);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center size-full">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative z-100 bg-gray3 rounded-2xl shadow-lg w-[70%] sm:w-[80%] md:w-[70%] lg:w-[60%] 2xl:w-1/2 p-6 max-h-[90vh] overflow-y-auto space-y-2 md:space-y-4">
        <div className="flex items-center justify-between ">
          <h2 className="text-base sm:text-xl font-semibold">Detalle de factura</h2>
              <button className="py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato font-bold bg-black border-black text-white hover:bg-gray-700 hover:border-gray-700 transition duration-300"
              onClick={onClose}>
              Cancelar
            </button>
        </div>

        {loading && <div className="p-4">Cargando…</div>}
        {error && <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded">{error}</div>}

        {data && !loading && !error && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 2xl:grid-cols-2 space-y-4">
              <div className="text-sm md:text-base" >
                <div><span className="text-gray-600">Factura:</span> <span className="font-medium">{data.invoice_number || data.id}</span></div>
                <div><span className="text-gray-600">Fecha:</span> <span className="font-medium">{
                  (() => {
                    const issue: string | undefined = data.issue_date ?? undefined;
                    const created: string | undefined = data.createdAt ?? undefined;
                    const isDateOnly = typeof issue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(issue);
                    const source: string | undefined = (isDateOnly || !issue) ? (created ?? issue) : (issue ?? created);
                    if (!source) return "-";
                    const dt = new Date(source);
                    return isNaN(dt.getTime()) ? "-" : dt.toLocaleString();
                  })()
                }</span></div>
                <div><span className="text-gray-600">Estado:</span> <span className="font-medium">{mapStatusToES(data.status)}</span></div>
              </div>
              <div className="text-sm md:text-base">
                <div><span className="text-gray-600">Cliente:</span> <span className="font-medium">{data.customer ? `${data.customer.name} ${data.customer.last_name}` : `#${data.customer_id}`}</span></div>
                <div><span className="text-gray-600">Método:</span> <span className="font-medium">{mapPaymentMethodToES(data.payment_method)}</span></div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl  max-h-80 overflow-y-auto">
              <table className="min-w-full text-sm bg-white">
                <thead className="bg-white border-b border-gray-200 text-[10px] sm:text-xs font-semibold font-Lato uppercase tracking-wide text-gray-600 rounded-2xl">
                  <tr className="text-center">
                    <th className="px-0.5 sm:px-2 md:px-4 xl:px-6 py-2 sm:text-left">Producto</th>
                    <th className="px-0.5 sm:px-2 md:px-4 xl:px-6 py-2">SKU</th>
                    <th className="px-0.5 sm:px-2 md:px-4 xl:px-6 py-2 ">Cant.</th>
                    <th className="px-0.5 sm:px-2 md:px-4 xl:px-6 py-2 ">Precio Unit.</th>
                    <th className="px-0.5 sm:px-2 md:px-4 xl:px-6 py-2 ">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.products.map((p) => (
                    <tr key={p.id}>
                      <td className="px-0.5 sm:px-2 md:px-4 xl:px-6 py-2 text-center sm:text-left text-xs sm:text-sm">{p.name || `#${p.id}`}</td>
                      <td className="px-0.5 sm:px-2 md:px-4 xl:px-6 py-2 text-center text-xs sm:text-sm">{p.sku || '-'}</td>
                      <td className="px-0.5 sm:px-2 md:px-4 xl:px-6 py-2 text-center text-xs sm:text-sm">{Number(p.quantity ?? 0)}</td>
                      <td className="px-0.5 sm:px-2 md:px-4 xl:px-6 py-2 text-center text-xs sm:text-sm">{p.unit_price != null ? Number(p.unit_price).toFixed(2) : '0.00'}</td>
                      <td className="px-0.5 sm:px-2 md:px-4 xl:px-6 py-2 text-center text-xs sm:text-sm">{(Number(p.unit_price ?? 0) * Number(p.quantity ?? 0)).toFixed(2)}</td>
                    </tr>
                  ))}
                  {data.products.length === 0 && (
                    <tr>
                      <td className="px-0.5 sm:px-2 md:px-4 xl:px-6 py-6 text-center text-gray-500 text-xs sm:text-sm" colSpan={5}>Sin productos</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end space-y-1 ">
              <div className="w-full md:w-72 space-y-1 text-xs sm:text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-medium">{totals.subtotal != null ? totals.subtotal.toFixed(2) : '-'}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Impuestos</span><span className="font-medium">{totals.tax_total != null ? totals.tax_total.toFixed(2) : '-'}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Pagado</span><span className="font-medium">{data.amount_paid != null ? Number(data.amount_paid).toFixed(2) : '0.00'}</span></div>
                <div className="flex justify-between text-sm sm:text-base"><span className="text-gray-700">Total</span><span className="font-semibold">{totals.total != null ? totals.total.toFixed(2) : '-'}</span></div>
                <div className="flex justify-between text-sm sm:text-base"><span className="text-gray-700">Pendiente</span><span className="font-semibold">{totals.total != null ? Math.max(totals.total - Number(data.amount_paid ?? 0), 0).toFixed(2) : '-'}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

