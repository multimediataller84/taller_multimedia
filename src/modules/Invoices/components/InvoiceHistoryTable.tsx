import React from "react";
import type { TInvoiceEndpoint } from "../models/types/TInvoiceEndpoint";
import { mapPaymentMethodToES, mapStatusToES } from "../utils/displayMappers";

interface Props {
  data: TInvoiceEndpoint[];
  onSelect?: (invoice: TInvoiceEndpoint) => void;
}

export const InvoiceHistoryTable: React.FC<Props> = ({ data, onSelect }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-white border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-600 ">
            <tr className="text-left">
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Fecha</th>
              <th className="px-6 py-3">Cliente</th>
              <th className="px-6 py-3">Método</th>
              <th className="px-6 py-3 ">Subtotal</th>
              <th className="px-6 py-3 ">Total</th>
              <th className="px-6 py-3 ">Pagado</th>
              <th className="px-6 py-3 ">Pendiente</th>
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
              const paid = inv.amount_paid != null ? Number(inv.amount_paid) : 0;
              const due = total != null ? Math.max(Number(total) - Number(paid), 0) : undefined;
              const customer = inv.customer ? `${inv.customer.name} ${inv.customer.last_name}` : `#${inv.customer_id}`;
              return (
                <tr
                  key={inv.id}
                  onClick={() => onSelect?.(inv)}
                  className={onSelect ? "cursor-pointer hover:bg-gray-50" : undefined}
                >
                  <td className="px-6 py-3">{inv.id}</td>
                  <td className="px-6 py-3">{formatted}</td>
                  <td className="px-6 py-3">{customer}</td>
                  <td className="px-6 py-3">{mapPaymentMethodToES(inv.payment_method)}</td>
                  <td className="px-6 py-3 ">{subtotal !== undefined ? subtotal.toFixed(2) : "-"}</td>
                  <td className="px-6 py-3 ">{total !== undefined ? total.toFixed(2) : "-"}</td>
                  <td className="px-6 py-3 ">{Number.isFinite(paid) ? paid.toFixed(2) : "-"}</td>
                  <td className="px-6 py-3 ">{due !== undefined ? due.toFixed(2) : "-"}</td>
                  <td className="px-6 py-3">{mapStatusToES(inv.status)}</td>
                </tr>
              );
            })}
            {data.length === 0 && (
              <tr>
                <td className="px-6 py-6 text-center text-gray-500" colSpan={9}>Sin facturas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
