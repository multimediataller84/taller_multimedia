import { useProduct } from "../hooks/useProduct";
import { ProductFormModal } from "../components/ProductFormModal";
import Select from "react-select";
import TaxExcelUploader from "../components/TaxExcelUploader";
import { ProductTable } from "../components/ProductsTable";
import { RootLayout } from "../../../_Layouts/RootLayout";

export default function Product() {
  const {
    searchProducts,
    setSearchProducts,
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
    <RootLayout search={searchProducts} setSearch={setSearchProducts}>
      <div className="flex-1 bg-[#DEE8ED] w-full h-screen p-8 space-y-8 ">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-2.5">
            <h2 className="font-Lato text-2xl">Inventario</h2>
            <h3 className="font-Lato font-medium text-base text-gray1">
              Lista completa del inventario de productos en sistema
            </h3>
          </div>
          
          <div className="flex space-x-2">

            <select className="appearance-none w-[220px]  border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base focus:outline-blue-500 focus:outline-2"
            id="categoria"
            name="categoria">
              <option>Categoría</option>
              <option >Administrador</option>
              <option >Empleado</option>
            </select> 
        
            <button
            onClick={openCreate}
            className="w-[220px] border rounded-3xl py-2  font-Lato text-base mr-4 
              transition duration-300 bg-blue-500 border-blue-500 hover:bg-blue-800 hover:border-blue-800 text-white">
              Añadir Producto
            </button>
          </div>
                   
      
        </div>

       {/*<TaxExcelUploader />*/}

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
