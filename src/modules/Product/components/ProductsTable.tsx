import { fmtCRC } from "../utils/formatters";
import type { TProductEndpoint } from "../models/types/TProductEndpoint";
import { useState } from "react";

interface ProductsProps  {
  products: TProductEndpoint[];
  headers: { key: string; label: string }[];
  onEdit: (row: TProductEndpoint) => void;
  onDelete: (row: TProductEndpoint) => void;
  categoryNameById?: Record<string | number, string>;
};

export function ProductTable(props: ProductsProps) {
  const {
    products, headers, onEdit, onDelete,
    categoryNameById = {},
  } = props;

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const handleToggleMenu = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const renderCategory = (category_id: any) => {
    const key = String(category_id);
    return categoryNameById[key] ?? categoryNameById[Number(key)] ?? category_id;
  };

  return (
    <table className="table-fixed w-full bg-white rounded-2xl">
      <thead className="w-full">
        <tr>
          {headers.map((item, index) => {
            const pretty =
              item.key === "category_id" ? "Categoría" :
              item.key === "tax_id"      ? "Impuesto"  :
              item.label ?? item.key;
            return (
              <th
                key={item.key}
                className={`
                  px-0.5 sm:px-2 md:px-2 2xl:px-4 py-3 font-lato font-medium text-center text-[10px] lg:text-sm 2xl:text-base
                  ${index === 0 ? "rounded-tl-2xl" : ""} 
                `}
              >
                {pretty}
              </th>
            );
          })}
          <th className="rounded-tr-2xl px-0.5 sm:px-2 md:px-2 2xl:px-4 py-3 font-lato font-medium text-center text-[10px] lg:text-sm 2xl:text-base"></th>
        </tr>
      </thead>
      
      <tbody className="bg-white ">
        {products.map((row) => (
          <tr
            key={row.id}
            className={`border-graybar border-y-2 font-Lato hover:bg-gray-50 transition ${openMenuId === row.id ? "bg-gray-200":""}`}>
            <td className="px-0.5 sm:px-2 md:px-2 xl:px-4 text-center text-[10px] lg:text-sm">{row.product_name}</td>
            <td className="px-0.5 sm:px-2 md:px-2 xl:px-4 text-center text-[10px] lg:text-sm">{row.sku}</td>
            <td className="px-0.5 sm:px-2 md:px-2 xl:px-4 text-center text-[10px] lg:text-sm">{renderCategory(row.category_id)}</td>
            <td className="px-0.5 sm:px-2 md:px-2 xl:px-4 text-center text-[10px] lg:text-sm">{row.tax.percentage + "%"}</td>
            <td className="px-0.5 sm:px-2 md:px-2 xl:px-4 text-center text-[10px] lg:text-sm">
              {(() => {
                const cost = Number(row.unit_price || 0);                 // ahora es COSTO
                const marginCRC = Number((row as any).profit_margin || 0); // utilidad en colones
                if (!Number.isFinite(cost) || cost <= 0) return "0%";
                const pct = (marginCRC / cost) * 100;
                return `${Math.round(pct)}%`;
              })()}
            </td>
            <td className="px-0.5 sm:px-2 md:px-2 xl:px-4 text-center text-[10px] lg:text-sm">{fmtCRC(row.unit_price)}</td>
            <td className="px-0.5 sm:px-2 md:px-2 xl:px-4 text-center text-[10px] lg:text-sm">{fmtCRC(Number(row.unit_price) + Number(row.profit_margin) + ((Number(row.unit_price) + Number(row.profit_margin)) * (Number(row.tax.percentage) / 100 )))}</td>
            <td className="px-0.5 sm:px-2 md:px-2 xl:px-4 text-center text-[10px] lg:text-sm">{row.stock}</td>
            <td className="px-0.5 sm:px-2 md:px-2 xl:px-4 text-center text-[10px] lg:text-sm">{row.state}</td>

            <td className="relative">
              <div className="flex justify-center items-center w-full h-full">
                <button
                  className={`rounded-full w-10 h-9 xl:w-13 xl:h-12 border group active:outline-hidden 
                    flex justify-center items-center transition duration-300 ease-in-out hover:scale-110  
                    ${openMenuId === row.id ? "bg-blue-500 border-blue-500" : "bg-white border-gray2 hover:bg-gray2"}`}
                  onClick={() => handleToggleMenu(row.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`size-4 2xl:size-5 translate-y-1 ${openMenuId === row.id ? "fill-white" : "fill-gray"}`}
                  >
                    <path d="M6 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a 2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                  </svg>
                </button>
              </div>

               {openMenuId === row.id && (
                <div
                  className="absolute flex flex-row bg-white p-2 sm:p-2.5 md:p-3 rounded-3xl shadow
                            space-x-2 sm:space-x-3 md:space-x-4 
                            right-full mr-3 top-1/2 -translate-y-1/2 z-20 w-auto"
                >
                  <button
                    className="py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato font-bold transition duration-300
                             bg-black border border-black text-white 
                              hover:bg-blue-500 hover:border-blue-500"
                    onClick={() => onEdit(row)}
                  >
                    Editar
                  </button>
                  <button
                    className="py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato font-bold transition duration-300
                    bg-black border border-black text-white  
                              hover:bg-[#D32626] hover:border-[#D32626]"
                    onClick={() => onDelete(row)}
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))}
        <tr className="border-graybar text-center h-4 font-Lato"></tr>
      </tbody>
    </table>
  );
}
