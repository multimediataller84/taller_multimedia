import React from "react";
import { TInvoiceItem } from "../models/types/TInvoiceItem";

interface Props {
  items: TInvoiceItem[];
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
}

export const InvoiceItemsTable: React.FC<Props> = ({ items, onIncrease, onDecrease, onRemove }) => {
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr className="text-left">
              <th className="px-6 py-3">SKU</th>
              <th className="px-6 py-3">Cant.</th>
              <th className="px-6 py-3">Impuesto ID</th>
              <th className="px-6 py-3 text-right">Precio Unit.</th>
              <th className="px-6 py-3 text-right">Precio Total</th>
              <th className="px-6 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((i) => (
              <tr key={i.product_id}>
                <td className="px-6 py-3 text-gray-700">{i.sku}</td>
                <td className="px-6 py-3">
                  <div className="inline-flex items-center border rounded-full overflow-hidden">
                    <button className="px-3 py-1" onClick={() => onDecrease(i.product_id)}>-</button>
                    <span className="px-4 select-none">{i.qty}</span>
                    <button className="px-3 py-1" onClick={() => onIncrease(i.product_id)}>+</button>
                  </div>
                </td>
                <td className="px-6 py-3">{i.tax_id}</td>
                <td className="px-6 py-3 text-right">{Number(i.unit_price).toFixed(2)}</td>
                <td className="px-6 py-3 text-right">{(Number(i.unit_price) * i.qty).toFixed(2)}</td>
                <td className="px-6 py-3 text-right">
                  <button className="text-red-600" onClick={() => onRemove(i.product_id)}>Quitar</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="px-6 py-6 text-center text-gray-500" colSpan={6}>Sin productos añadidos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
