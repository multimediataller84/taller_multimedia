import { useProduct } from "../hooks/useProduct";
import { ProductFormModal } from "../components/ProductFormModal";
import TaxExcelUploader from "../components/TaxExcelUploader";
import { ProductTable } from "../components/ProductsTable";
import { RootLayout } from "../../../_Layouts/RootLayout";

export default function Product() {
  const {
    loading,
    fetchProducts,
    isModalOpen,
    editing,
    setActivePage,
    currentProducts,
    headers,
    handleDelete,
    openEdit,
    openCreate,
    setIsModalOpen,
    activePage,
  } = useProduct();

  return (
    <RootLayout search="" setSearch={() => {}}>
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

        <TaxExcelUploader />

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

        <div className="mt-6 mb-8 pr-19 w-auto space-x-4 justify-between font-Lato font-medium">
          {[1, 2, 3, "...", 8].map((num, index) => (
            <button
              key={index}
              className={`size-[42px] border rounded-full active:outline-0 
                ${
                  activePage === num
                    ? "bg-blue-500 text-white"
                    : "bg-white border-gray2 text-gray1"
                }`}
              onClick={() => typeof num === "number" && setActivePage(num)}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editing}
        onChange={fetchProducts}
      />
    </RootLayout>
  );
}
