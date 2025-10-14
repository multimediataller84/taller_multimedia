import { fmtCRC, fmtMargin } from "../utils/formatters";
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
      <thead className="h-16 w-full bg-white">
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
                  h-16 px-4 text-center font-lato font-medium text-base
                  ${index === 0 ? "rounded-tl-xl" : ""} 
                `}
              >
                {pretty}
              </th>
            );
          })}
          <th className="rounded-tr-xl"></th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {products.map((row) => (
          <tr
            key={row.id}
            className={`border-graybar border-y-2 text-center h-16 font-Lato hover:bg-gray3 transition ${openMenuId === row.id ? "bg-gray-200":""}`}
          >
            <td className="text-base">{row.product_name}</td>
            <td className="text-sm">{row.sku}</td>

            <td className="text-sm">{renderCategory(row.category_id)}</td>

            {/* porcentaje viene del endpoint embebido en row.tax */}
            <td className="text-sm">{row.tax.percentage + "%"}</td>

            <td className="text-sm">{fmtMargin(row.profit_margin)}</td>
            <td className="text-sm">{fmtCRC(row.unit_price)}</td>
            <td className="text-sm">{row.stock}</td>
            <td className="text-sm">{row.state}</td>
            <td className="flex w-full justify-center pt-2">
              <button
                className={`pt-3 rounded-full w-13 h-12 border group active:outline-hidden 
                flex justify-center items-center transition duration-300 ease-in-out hover:scale-110  
                ${openMenuId === row.id ? "bg-blue-500 border-blue-500" : "bg-white border-gray2 hover:bg-gray2"}`}
                onClick={() => handleToggleMenu(row.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                  className={`size-5 ${openMenuId === row.id ? "fill-white" : "fill-gray"}`}>
                  <path d="M6 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a 2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a 2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
                </svg>
              </button>

              {openMenuId === row.id && (
                <div className="flex bg-white absolute -translate-y-1 p-1.5 -translate-x-40 space-x-4 rounded-4xl shadow">
                  <button
                    className="w-[94px] py-2 rounded-3xl font-Lato font-bold transition duration-300 
                      bg-black border border-black text-white hover:bg-blue-500 hover:border-blue-500"
                    onClick={() => onEdit(row)}
                  >
                    Editar
                  </button>
                  <button
                    className="w-[94px] py-2 rounded-3xl bg-black border border-black
                      hover:bg-[#D32626] hover:border-[#D32626] text-white font-Lato font-bold transition duration-300"
                    onClick={() => onDelete(row)}
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))}
        <tr className="border-graybar text-center h-8 font-Lato"></tr>
      </tbody>
    </table>
  );
}
