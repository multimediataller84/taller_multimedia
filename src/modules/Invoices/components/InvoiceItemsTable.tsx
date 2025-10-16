import React from "react";
import { TInvoiceItem } from "../models/types/TInvoiceItem";

interface Props {
  items: TInvoiceItem[];
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
  disabled?: boolean;
}

export const InvoiceItemsTable: React.FC<Props> = ({ items, onIncrease, onDecrease, onRemove, disabled = false }) => {
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr className="text-left">
              <th className="px-6 py-3">Producto</th>
              <th className="px-6 py-3">Cant.</th>
              <th className="px-6 py-3">Impuesto</th>
              <th className="px-6 py-3 text-right">Precio Unit.</th>
              <th className="px-6 py-3 text-right">Precio Total</th>
              <th className="px-6 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((i) => (
              <tr key={i.product_id}>
                <td className="px-6 py-3 text-gray-700">{i.product_name}</td>
                <td className="px-6 py-3">
                  <div className={`inline-flex items-center border rounded-full overflow-hidden ${disabled ? 'opacity-50' : ''}`}>
                    <button
                      className={`px-3 py-1 ${disabled ? 'cursor-not-allowed bg-gray-100 text-gray-400' : 'hover:bg-gray-100'}`}
                      onClick={() => !disabled && onDecrease(i.product_id)}
                      disabled={disabled}
                    >
                      -
                    </button>
                    <span className="px-4 select-none">{i.qty}</span>
                    <button
                      className={`px-3 py-1 ${disabled ? 'cursor-not-allowed bg-gray-100 text-gray-400' : 'hover:bg-gray-100'}`}
                      onClick={() => !disabled && onIncrease(i.product_id)}
                      disabled={disabled}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-6 py-3">{typeof i.tax_percentage === 'number' ? `${i.tax_percentage}%` : i.tax_id}</td>
                <td className="px-6 py-3 text-right">{Number(i.unit_price).toFixed(2)}</td>
                <td className="px-6 py-3 text-right">{(Number(i.unit_price) * i.qty).toFixed(2)}</td>
                <td className="px-6 py-3 text-right">
                  <button
                    className={`text-red-600 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-red-800'}`}
                    onClick={() => !disabled && onRemove(i.product_id)}
                    disabled={disabled}
                  >
                    Quitar
                  </button>
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
