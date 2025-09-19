import { fmtCRC, fmtMargin } from "../utils/formatters";
import type { TProductEndpoint } from "../models/types/TProductEndpoint";

type Props = {
  products: TProductEndpoint[];
  headers: { key: string; label: string }[];
  onEdit: (row: TProductEndpoint) => void;
  onDelete: (row: TProductEndpoint) => void;
};

export function ProductTable({ products, headers, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-[#E9EEF0] ">
      <table className="min-w-full text-base">
        <thead className="bg-gray-50">
          <tr className="">
            {headers.map((item) => (
              <th
                key={item.key}
                className="text-left px-4 py-8 font-medium text-gray-700 "
              >
                {item.label}
              </th>
            ))}
            <th className="">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white  ">
          {products.map((row) => (
            <tr key={row.id} className=" border-graybar border-y-2">
              <td className="py-2 px-4">{row.product_name}</td>
              <td className="py-2">{row.sku}</td>
              <td className="py-2">{row.category_id}</td>
              <td className="py-2">{row.tax_id}</td>
              <td className="py-2">{fmtMargin(row.profit_margin)}</td>
              <td className="py-2">{fmtCRC(row.unit_price)}</td>
              <td className="py-2">{row.stock}</td>
              <td className="py-2">{row.state}</td>
              <td className="py-2">
                <div className="flex justify-center w-auto space-x-2">
                  <button
                    title="Editar"
                    className="w-[94px] py-2 rounded-3xl font-Lato font-bold transition duration-300 
                    bg-white text-gray1 border-gray2 border hover:bg-blue-500 hover:border-blue-500 hover:text-white"
                    onClick={() => onEdit(row)}
                  >
                    Editar
                  </button>
                  <button
                    title="Eliminar"
                    className="w-[94px] py-2 rounded-3xl bg-[#FF4747] border 
                    border-[#FF4747] hover:bg-[#D32626] text-white font-Lato font-bold transition duration-300 "
                    onClick={() => onDelete(row)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td
                colSpan={headers.length + 1}
                className="py-6 text-center text-gray-500"
              >
                No hay productos para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
