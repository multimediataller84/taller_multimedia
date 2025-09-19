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
    <div className="overflow-x-auto border rounded bg-white">
      <table className="min-w-full text-base">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((item) => (
              <th
                key={item.key}
                className="text-left px-3 py-2 font-medium text-gray-700"
              >
                {item.label}
              </th>
            ))}
            <th className="py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((row) => (
            <tr key={row.id} className="border-t">
              <td className="py-2">{row.product_name}</td>
              <td className="py-2">{row.sku}</td>
              <td className="py-2">{row.category_id}</td>
              <td className="py-2">{row.tax_id}</td>
              <td className="py-2">{fmtMargin(row.profit_margin)}</td>
              <td className="py-2">{fmtCRC(row.unit_price)}</td>
              <td className="py-2">{row.stock}</td>
              <td className="py-2">{row.state}</td>
              <td className="py-2">
                <div className="flex justify-end gap-2">
                  <button
                    title="Editar"
                    className="px-2 py-1 rounded border"
                    onClick={() => onEdit(row)}
                  >
                    ✏️
                  </button>
                  <button
                    title="Eliminar"
                    className="px-2 py-1 rounded border text-red-600"
                    onClick={() => onDelete(row)}
                  >
                    🗑️
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

      <div className="flex items-center justify-between py-2 text-xs text-gray-500">
        <span>Mostrando {products.length} resultados</span>
        <div className="flex items-center gap-1">
          <button className="h-8 w-8 border rounded">◀</button>
          <button className="h-8 w-8 border rounded">1</button>
          <button className="h-8 w-8 border rounded">2</button>
          <span className="px-1">…</span>
          <button className="h-8 w-8 border rounded">8</button>
          <button className="h-8 w-8 border rounded">▶</button>
        </div>
      </div>
    </div>
  );
}
