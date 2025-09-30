import React from "react";
import type { TInvoiceEndpoint } from "../models/types/TInvoiceEndpoint";

interface Props {
  data: TInvoiceEndpoint[];
}

export const InvoiceHistoryTable: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr className="text-left">
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Fecha</th>
              <th className="px-6 py-3">Cliente</th>
              <th className="px-6 py-3">Método</th>
              <th className="px-6 py-3 text-right">Subtotal</th>
              <th className="px-6 py-3 text-right">Total</th>
              <th className="px-6 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((inv) => {
              const dateStr = inv.createdAt || inv.issue_date || inv.updatedAt || inv.due_date || "";
              const d = dateStr ? new Date(dateStr) : null;
              const formatted = d ? d.toLocaleString() : "-";
              const subtotal = inv.subtotal != null ? Number(inv.subtotal) : undefined;
              const total = inv.total != null ? Number(inv.total) : undefined;
              const customer = inv.customer ? `${inv.customer.name} ${inv.customer.last_name}` : `#${inv.customer_id}`;
              return (
                <tr key={inv.id}>
                  <td className="px-6 py-3">{inv.invoice_number || inv.id}</td>
                  <td className="px-6 py-3">{formatted}</td>
                  <td className="px-6 py-3">{customer}</td>
                  <td className="px-6 py-3">{inv.payment_method}</td>
                  <td className="px-6 py-3 text-right">{subtotal !== undefined ? subtotal.toFixed(2) : "-"}</td>
                  <td className="px-6 py-3 text-right">{total !== undefined ? total.toFixed(2) : "-"}</td>
                  <td className="px-6 py-3">{inv.status}</td>
                </tr>
              );
            })}
            {data.length === 0 && (
              <tr>
                <td className="px-6 py-6 text-center text-gray-500" colSpan={7}>Sin facturas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
