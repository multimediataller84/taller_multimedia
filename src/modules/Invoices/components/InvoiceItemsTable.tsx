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
    <div className="overflow-hidden">
      <div className="h-30 md:h-50 lg:h-60 xl:h-70 overflow-y-scroll rounded-2xl bg-white ">
        <table className="w-full text-sm bg-white ">
          <thead className="bg-white border-b border-gray-200 text-[10px] sm:text-xs font-semibold font-Lato uppercase tracking-wide text-gray-600 rounded-2xl">
            <tr className="text-left">
              <th className="px-2 sm:px-4 md:px-5 xl:px-6 py-3 text-left">Producto</th>
              <th className="px-0.5 sm:px-2 md:px-4 xl:px-6 py-3 text-center">Cant.</th>
              <th className="px-0.5 sm:px-2 md:px-4 xl:px-6 py-3 text-center">Gramos</th>
              <th className="px-0.5 sm:px-2 md:px-4 xl:px-6 text-center">Impuesto</th>
              <th className="px-0.5 sm:px-2 md:px-4 xl:px-6 text-center">Precio Unit.</th>
              <th className="px-0.5 sm:px-2 md:px-4 xl:px-6 text-center">Precio Total</th>
              <th className="px-0.5 sm:px-2 md:px-4 xl:px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((i) => (
              <tr key={i.product_id}>
                <td className="px-2 sm:px-4 md:px-4.5 xl:px-6 py-3 text-xs sm:text-sm text-gray-700">{i.product_name}</td>
                <td className="px-0.5 sm:px-2 md:px-4 xl:px-6 py-3 justify-center flex">
                  <div className={`flex w-auto xl:w-[94px] justify-center items-center border rounded-full overflow-hidden ${disabled ? 'opacity-50' : ''}`}>
                    <button
                      className={`px-1.5 sm:px-2 md:px-2.5 xl:px-3 py-1 text-[10px] md:text-sm ${disabled ? 'cursor-not-allowed bg-gray-100 text-gray-400' : 'hover:bg-gray-100'}`}
                      onClick={() => !disabled && onDecrease(i.product_id)}
                      disabled={disabled}
                    >
                      -
                    </button>
                    <span className="px-2 sm:px-2.5 md:px-2 xl:px-4 select-none text-[10px] md:text-sm ">{i.qty}</span>
                    <button
                      className={`px-1.5 sm:px-2 md:px-2.5 xl:px-3 py-2 text-[10px] md:text-sm ${disabled ? 'cursor-not-allowed bg-gray-100 text-gray-400' : 'hover:bg-gray-100'}`}
                      onClick={() => !disabled && onIncrease(i.product_id)}
                      disabled={disabled}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-0.5 sm:px-2 md:px-4 xl:px-6 py-3 text-center">
                  {((i.unit_measure_symbol || "").toLowerCase() === "kg") || (i.unit_measure_description || "").toLowerCase().includes("kilo") ? (
                    <input
                      type="number"
                      min={0}
                      placeholder="gramos"
                      className="w-20 sm:w-24 md:w-28 px-2 py-1 border rounded-3xl text-[10px] sm:text-xs text-center"
                      disabled={disabled}
                    />
                  ) : (
                    <span className="text-xs sm:text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="px-0.5 sm:px-2 md:px-4 xl:px-6  py-3 text-center text-xs sm:text-sm">{typeof i.tax_percentage === 'number' ? `${i.tax_percentage}%` : i.tax_id}</td>
                <td className="px-0.5 sm:px-2 md:px-4 xl:px-6  py-3 text-center text-xs sm:text-sm">{(i.unit_price + i.profit_margin).toFixed(2)}</td>
                <td className="px-0.5 sm:px-2 md:px-4 xl:px-6  py-3 text-center text-xs sm:text-sm">{((((i.unit_price + i.profit_margin) * i.qty)) + ((i.unit_price + i.profit_margin) * (i.tax_percentage) / 100 )).toFixed(2)}</td>
                <td className="px-0.5 sm:px-2 md:px-4 xl:px-6  py-3 text-center text-xs sm:text-sm">
                  <button
                    className={`text-white bg-black py-2 rounded-3xl w-12 sm:w-16 md:w-18 xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato ${disabled ? ' cursor-not-allowed' : 'hover:bg-red-800 cursor-pointer '}`}
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
                <td className="px-6 py-6 text-center text-gray-500" colSpan={7}>Sin productos añadidos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
