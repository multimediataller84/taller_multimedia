import React, { useEffect } from "react";
import { TProductEndpoint } from "../../Product/models/types/TProductEndpoint";
import { useProductCatalog } from "../hooks/useProductCatalog";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (p: TProductEndpoint) => void;
}

export const ProductPickerModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const { loading, query, setQuery, products, refetch } = useProductCatalog();

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center size-full">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative z-100 bg-gray3 rounded-2xl shadow-lg w-[70%] sm:w-[80%] md:w-[70%] lg:w-[60%] 2xl:w-1/2 p-6 max-h-[90vh] overflow-y-auto space-y-2 md:space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-xl font-semibold">Seleccionar productos</h3>
          <button className="py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato font-bold bg-black border-black text-white hover:bg-gray-700 hover:border-gray-700 transition duration-300"
              onClick={onClose}>
              Cancelar
            </button>
        </div>

        <div className="flex flex-col space-y-2 ">
        <input className="w-full py-2 border rounded-3xl px-4 text-gray1 bg-white text-sm sm:text-base transition-colors  border-gray2 font-medium
          focus:outline-2 focus:outline-blue-500 font-Lato"
          placeholder="Buscar por nombre, SKU o impuesto"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        </div>

        {loading ? (
          <div className="w-full h-96 flex justify-center ">
            <div className="translate-y-35 w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-blue-500"></div>
          </div>
        ) : (
          <div className="h-96 pr-8 overflow-auto space-y-2">
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-white rounded-xl shadow ">
                <div>
                  <div className="text-sm sm:text-base text-black font-medium">{p.product_name}</div>
                  <div className="text-xs sm:text-base text-gray-600">SKU: {p.sku} · Impuesto: {p.tax.percentage + "%"}</div>
                  {p.stock > 0 && (
                    <div className="text-sm sm:text-base py-0.5 text-orange-700 font-semibold">Stock: {p.stock}</div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm sm:text-base text-black font-medium">₡{(Number(p.unit_price) + Number(p.profit_margin)).toFixed(2)}</div>
                  <button
                    className="cursor-pointer py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato font-bold bg-blue-500 text-white hover:bg-blue-800 transition"
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
