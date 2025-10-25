import { useEffect, useState } from "react";
import { useProduct } from "../hooks/useProduct";
import { ProductFormModal } from "../components/ProductFormModal";
import { ProductTable } from "../components/ProductsTable";
import { RootLayout } from "../../../_Layouts/RootLayout";
import { UseCasesController } from "../controllers/useCasesController";
import { ProductRepository } from "../repositories/productRepository";
import { ProductsTableSkeleton } from "../components/ProductsTableSkeleton";
import Pagination from "../../../components/pagination";

export default function Product() {
  const {
    searchProducts, setSearchProducts,
    loading, fetchProducts,
    isModalOpen, editing, setActivePage,
    currentProducts, headers, handleDelete,
    openEdit, openCreate, setIsModalOpen,
    activePage, totalPages, canPrev, canNext,
    goPrev, goNext, pagesDisplay,
    categoryFilter, setCategoryFilter,
  } = useProduct();

  const [categoryNameById, setCategoryNameById] = useState<Record<number, string>>({});

  useEffect(() => {
    const repo = ProductRepository.getInstance();
    const useCases = new UseCasesController(repo);

    const loadLookups = async () => {
      try {
        const categories = await useCases.getAllCategories.execute();
        const catMapNumStr: Record<string | number, string> = {};
        for (const c of categories) {
          const id = (c as any)?.id;
          const name = (c as any)?.name ?? String(id);
          if (id != null) {
            catMapNumStr[Number(id)] = name;
            catMapNumStr[String(id)] = name;
          }
        }
        setCategoryNameById(catMapNumStr as Record<number, string>);
      } catch (err) {
        console.error("Error al cargar categorías", err);
      }
    };

    loadLookups();
  }, []);

  useEffect(() => {
  // Cargamos categorías e impuestos con paginación
  const repo = ProductRepository.getInstance();
  const useCases = new UseCasesController(repo);

  const loadLookups = async () => {
    // --- Categorías ---
    try {
      const categories = await useCases.getAllCategories.execute();
      const catMapNumStr: Record<string | number, string> = {};
      for (const c of categories) {
        const id = (c as any)?.id;
        const name = (c as any)?.name ?? String(id);
        if (id != null) {
          catMapNumStr[Number(id)] = name;
          catMapNumStr[String(id)] = name;
        }
      }
      console.log("[LOOKUP] categorías:", Object.keys(catMapNumStr).length);
      setCategoryNameById(catMapNumStr as Record<number, string>);
    } catch (err) {
      console.error("Error al cargar categorías", err);
    }

    // --- Impuestos con PAGINACIÓN ---
    try {
      const pageSize = 500;
      let offset = 0;
      const taxMapNumStr: Record<string | number, number> = {};

      for (;;) {
        const resp = await useCases.getAllTaxes.execute({
          description: "",
          limit: pageSize,
          offset,
          orderDirection: "ASC",
        });

        const items = (resp?.data ?? []) as any[];
        if (!items.length) break;

        for (const t of items) {
          const id = t?.id;
          let pct = t?.percentage;
          if (id != null && pct != null) {
            pct = typeof pct === "number" ? pct : Number(pct);
            pct = Math.round(pct * 100) / 100;

            taxMapNumStr[Number(id)] = pct;
            taxMapNumStr[String(id)] = pct;
          }
        }

        offset += items.length;
        if (items.length < pageSize) break;
      }

      console.log("[LOOKUP] impuestos totales:", Object.keys(taxMapNumStr).length);
    } catch (err) {
      console.error("Error al cargar impuestos", err);
    }
  };

  loadLookups();
}, []);

  return (
    <RootLayout search={searchProducts} setSearch={setSearchProducts}>
      <div className="flex-1 bg-gray3 w-full h-screen p-8 space-y-8 ">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-2.5">
            <h2 className="font-Lato text-2xl">Inventario</h2>
            <h3 className="font-Lato font-medium text-base text-gray1">
              Lista completa del inventario de productos en sistema
            </h3>
          </div>

          <div className="flex space-x-2">
            <div className="relative">
              <select
                className="appearance-none w-[220px] border py-2 rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base focus:outline-blue-500 focus:outline-2"
                id="categoria"
                name="categoria"
                value={categoryFilter || ""} 
                onChange={(e) => setCategoryFilter(e.target.value)}  
              >
                <option value="">Todas las categorías</option>
                {Object.entries(categoryNameById)
                  .filter(([k]) => !Number.isNaN(Number(k)))               // evita duplicados string/number
                  .map(([id, name]) => ({ value: String(id), label: name }))
                  .sort((a, b) => a.label.localeCompare(b.label))
                  .map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))
                }
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 fill-gray1"
              >
                <path
                  fillRule="evenodd"
                  d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <button
              onClick={openCreate}
              className="w-[220px] border rounded-3xl py-2 font-Lato text-base mr-4 
              transition duration-300 bg-blue-500 border-blue-500 hover:bg-blue-800 hover:border-blue-800 text-white"
            >
              Añadir Producto
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-6">
            <ProductsTableSkeleton headers={headers} rows={8} />
          </div>
        ) : (
          <ProductTable
            products={currentProducts}
            headers={headers}
            onEdit={openEdit}
            onDelete={handleDelete}
            categoryNameById={categoryNameById}
          />
        )}

        <Pagination
          totalPages={totalPages}
          activePage={activePage}
          setActivePage={setActivePage}
          canPrev={canPrev}
          canNext={canNext}
          goPrev={goPrev}
          goNext={goNext}
          pagesDisplay={pagesDisplay}
        />
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
