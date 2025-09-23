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

  const [search, setSearch] = useState("");

  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10; 
  const filteredProducts = products.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return p.product_name?.toLowerCase().includes(q);
  });
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const safePage = Math.min(activePage, totalPages);
  const indexOfLast = safePage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  if (activePage !== 1 && search.length > 0 && indexOfFirst >= filteredProducts.length) {
    setActivePage(1);
  }

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
    <div className="flex absolute bg-[#DEE8ED] flex-col w-screen h-screen overflow-x-hidden">
      <div className="bg-[#DEE8ED] absolute size-full flex flex-col ">
        <div> 
          <Navbar search={search} onSearchChange={setSearch}></Navbar>
        </div>
        <div className="flex w-full h-full bg-[#DEE8ED] ">
          <Sidebar />
          <div className="flex-1 bg-[#DEE8ED] w-full h-screen p-8 space-y-4">
            <div className="flex items-center justify-between ">
              <h2 className="font-Lato text-2xl ">Productos</h2>
              <button
                onClick={openCreate}
              className="w-auto border rounded-3xl py-2 px-5 font-Lato text-base mr-4 
              transition duration-300 bg-blue-500 hover:bg-blue-800 text-white"
              >
                + Nuevo producto
              </button>
            </div>

            <div className="">
              <TaxExcelUploader />
            </div>

            {loading ? (
              <div className="p-6">Cargando…</div>
            ) : (
              <ProductTable
                products={currentProducts}
                headers={headers}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            )}
            

            <div className="mt-6 mb-8 pr-19 w-auto space-x-2 flex flex-wrap font-Lato font-medium">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  className={`size-[42px] border rounded-full active:outline-0 
                  ${activePage === num 
                  ? "bg-blue-500 text-white" 
                  : "bg-white border-gray2 text-gray1"}`}
                  onClick={() => setActivePage(num)}
                >
                  {num}
                </button>
              ))}
            </div>
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
