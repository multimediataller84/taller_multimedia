import React from "react";
import { useInvoiceDetail } from "../hooks/useInvoiceDetail";
import type { TInvoiceEndpoint } from "../models/types/TInvoiceEndpoint";

interface Props {
  open: boolean;
  invoice: TInvoiceEndpoint | null;
  onClose: () => void;
}

export const InvoiceDetailModal: React.FC<Props> = ({ open, invoice, onClose }) => {
  const { data, loading, error, totals } = useInvoiceDetail(invoice);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Detalle de factura</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>

        {loading && <div className="p-4">Cargando…</div>}
        {error && <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded">{error}</div>}

        {data && !loading && !error && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div><span className="text-gray-600">Factura:</span> <span className="font-medium">{data.invoice_number || data.id}</span></div>
                <div><span className="text-gray-600">Fecha:</span> <span className="font-medium">{(data.issue_date || data.createdAt || "-") && new Date(data.issue_date || data.createdAt || "").toLocaleString()}</span></div>
                <div><span className="text-gray-600">Estado:</span> <span className="font-medium">{data.status}</span></div>
              </div>
              <div>
                <div><span className="text-gray-600">Cliente:</span> <span className="font-medium">{data.customer ? `${data.customer.name} ${data.customer.last_name}` : `#${data.customer_id}`}</span></div>
                <div><span className="text-gray-600">Método:</span> <span className="font-medium">{data.payment_method}</span></div>
              </div>
            </div>

            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr className="text-left">
                    <th className="px-4 py-2">Producto</th>
                    <th className="px-4 py-2">SKU</th>
                    <th className="px-4 py-2 text-right">Cant.</th>
                    <th className="px-4 py-2 text-right">Precio Unit.</th>
                    <th className="px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.products.map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-2">{p.name || `#${p.id}`}</td>
                      <td className="px-4 py-2">{p.sku || '-'}</td>
                      <td className="px-4 py-2 text-right">{p.quantity}</td>
                      <td className="px-4 py-2 text-right">{p.unit_price != null ? Number(p.unit_price).toFixed(2) : '-'}</td>
                      <td className="px-4 py-2 text-right">{p.unit_price != null ? (Number(p.unit_price) * p.quantity).toFixed(2) : '-'}</td>
                    </tr>
                  ))}
                  {data.products.length === 0 && (
                    <tr>
                      <td className="px-4 py-6 text-center text-gray-500" colSpan={5}>Sin productos</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end space-y-1">
              <div className="w-full md:w-72 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-medium">{totals.subtotal != null ? totals.subtotal.toFixed(2) : '-'}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Impuestos</span><span className="font-medium">{totals.tax_total != null ? totals.tax_total.toFixed(2) : '-'}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Pagado</span><span className="font-medium">{data.amount_paid != null ? Number(data.amount_paid).toFixed(2) : '0.00'}</span></div>
                <div className="flex justify-between text-base"><span className="text-gray-700">Total</span><span className="font-semibold">{totals.total != null ? totals.total.toFixed(2) : '-'}</span></div>
                <div className="flex justify-between text-base"><span className="text-gray-700">Pendiente</span><span className="font-semibold">{totals.total != null ? Math.max(totals.total - Number(data.amount_paid ?? 0), 0).toFixed(2) : '-'}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
