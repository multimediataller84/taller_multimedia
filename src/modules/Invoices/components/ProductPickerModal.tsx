import React from "react";
import { TProductEndpoint } from "../../Product/models/types/TProductEndpoint";
import { useProductCatalog } from "../hooks/useProductCatalog";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (p: TProductEndpoint) => void;
}

export const ProductPickerModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const { loading, query, setQuery, products } = useProductCatalog();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-3xl rounded-md shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Seleccionar productos</h3>
          <button className="text-gray-600" onClick={onClose}>✕</button>
        </div>

        <input
          className="w-full border rounded-md px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Buscar por nombre, SKU o Impuesto ID"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {loading ? (
          <div className="py-8 text-center">Cargando…</div>
        ) : (
          <div className="max-h-96 overflow-auto divide-y">
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium">{p.product_name}</div>
                  <div className="text-xs text-gray-600">SKU: {p.sku} · Impuesto ID: {p.tax_id}</div>
                  {p.stock > 0 && (
                    <div className="text-xs text-green-600">Stock: {p.stock}</div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">${Number(p.unit_price).toFixed(2)}</div>
                  <button
                    className="border rounded-3xl py-1 px-4 bg-blue-500 text-white hover:bg-blue-800 transition"
                    onClick={() => {
                      onAdd(p);
                      onClose();
                    }}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div className="py-6 text-center text-gray-500">Sin resultados</div>
            )}
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <button
            className="border rounded-3xl py-2 px-5 bg-white border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
