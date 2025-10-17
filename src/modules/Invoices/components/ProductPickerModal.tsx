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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-3xl rounded-md shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Seleccionar productos</h3>
          <button
              className="w-[94px] py-2 rounded-3xl font-Lato font-bold bg-black text-white border-black hover:border-gray-700 hover:bg-gray-700"
              onClick={onClose}>
              Cancelar
            </button>
        </div>

        <input className="w-full py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base
          focus:outline-2 focus:outline-blue-500 font-Lato"
          placeholder="Buscar por nombre, SKU o impuesto"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {loading ? (
          <div className="py-8 text-center">Cargando…</div>
        ) : (
          <div className="max-h-96 pr-8 mt-4 overflow-auto divide-y">
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium">{p.product_name}</div>
                  <div className="text-xs text-gray-600">SKU: {p.sku} · Impuesto: {p.tax.percentage + "%"}</div>
                  {p.stock > 0 && (
                    <div className="text-sm text-green-600">Stock: {p.stock}</div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">₡{(Number(p.unit_price) + Number(p.profit_margin)).toFixed(2)}</div>
                  <button
                    className="border rounded-3xl py-2 px-4 bg-blue-500 text-white hover:bg-blue-800 transition"
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
     
      </div>
    </div>
  );
};
