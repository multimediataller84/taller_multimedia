import { useMemo, useState } from "react";
import { useProduct } from "../hooks/useProduct";
import type { TProductEndpoint } from "../models/types/TProductEndpoint";
import { ProductFormModal } from "../components/ProductFormModal";
import { Sidebar } from "../../../components/Sidebar";
import { Navbar } from "../../../components/navbar";
import TaxExcelUploader from "../components/TaxExcelUploader";
import { ProductTable } from "../components/ProductsTable";

export default function Product() {
  const {
    products,
    loading,
    deleteProduct,
    fetchProducts,
  } = useProduct();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<TProductEndpoint | null>(null);

  const openCreate = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  const openEdit = (row: TProductEndpoint) => {
    setEditing(row);
    setIsModalOpen(true);
  };

  const handleDelete = async (row: TProductEndpoint) => {
    if (confirm(`¿Eliminar producto "${row.product_name}"?`)) {
      await deleteProduct(row.id);
    }
  };

  const headers = useMemo(
    () => [
      { key: "product_name", label: "Nombre" },
      { key: "sku", label: "SKU" },
      { key: "category_id", label: "Cat. ID" },
      { key: "tax_id", label: "Impuesto ID" },
      { key: "profit_margin", label: "Margen" },
      { key: "unit_price", label: "Precio" },
      { key: "stock", label: "Stock" },
      { key: "state", label: "Estado" },
    ],
    []
  );

  return (
    <div className="flex absolute flex-col w-screen h-screen overflow-x-hidden">
      <div className="bg-[#DEE8ED] absolute size-full flex flex-col">
        <Navbar />
        <div className="flex w-full h-full bg-[#DEE8ED]">
          <Sidebar />
          <div className="p-6 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold mb-4">Productos</h1>
              <button
                onClick={openCreate}
                className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
              >
                + Nuevo producto
              </button>
            </div>

            <div className="mb-4">
              <TaxExcelUploader />
            </div>

            {loading ? (
              <div className="p-6">Cargando…</div>
            ) : (
              <ProductTable
                products={products}
                headers={headers}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>

        <ProductFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={editing}
          onChange={fetchProducts}
        />
      </div>
    </div>
  );
}


/*

<SearchBar
          placeholder="Buscar productos..."
          value={query}
          onChange={setQuery}
          username="Administrador"
        />
*/