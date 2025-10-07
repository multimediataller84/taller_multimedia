import { useEffect, useState } from "react";
import { useProduct } from "../hooks/useProduct";
import { ProductFormModal } from "../components/ProductFormModal";
import { ProductTable } from "../components/ProductsTable";
import { RootLayout } from "../../../_Layouts/RootLayout";

import { UseCasesController } from "../controllers/useCasesController";
import { ProductRepository } from "../repositories/productRepository";

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

  // Usamos claves numéricas y string para evitar mismatches al indexar.
  const [categoryNameById, setCategoryNameById] = useState<Record<string | number, string>>({});
  const [taxPctById, setTaxPctById] = useState<Record<string | number, number>>({});

  useEffect(() => {
    const repo = ProductRepository.getInstance();
    const useCases = new UseCasesController(repo);

    const loadLookups = async () => {
      // --- Categorías ---
      try {
        const categories = await useCases.getAllCategories.execute();
        const catMap: Record<string | number, string> = {};
        for (const c of categories) {
          const id = (c as any)?.id;
          const name = (c as any)?.name ?? String(id);
          if (id != null) {
            catMap[Number(id)] = name;
            catMap[String(id)] = name;
          }
        }
        console.log("[LOOKUP] categorías:", Object.keys(catMap).length);
        setCategoryNameById(catMap);
      } catch (err) {
        console.error("Error al cargar categorías", err);
        setCategoryNameById({});
      }

      // --- Impuestos (POST /tax/all) con paginación ---
      try {
        const pageSize = 500;
        let offset = 0;
        const taxMap: Record<string | number, number> = {};

        for (;;) {
          const resp = await useCases.getAllTaxes.execute({
            description: "",     // puedes pasar filtro si lo necesitas
            limit: pageSize,
            offset,
            orderDirection: "ASC",
          });

          const items = (resp?.data ?? []) as any[];
          if (!items.length) break;

          for (const t of items) {
            const id = t?.id;
            let pct = t?.percentage; // el back expone 'percentage'
            if (id != null && pct != null) {
              pct = typeof pct === "number" ? pct : Number(pct);
              // Si tu back devolviera 0.13 para 13%, descomenta la siguiente línea:
              // if (pct > 0 && pct <= 1) pct = pct * 100;

              // Redondeo a 2 decimales para la UI.
              pct = Math.round(pct * 100) / 100;

              taxMap[Number(id)] = pct;
              taxMap[String(id)] = pct;
            }
          }

          offset += items.length;
          if (items.length < pageSize) break; // última página
        }

        console.log("[LOOKUP] impuestos totales:", Object.keys(taxMap).length);
        setTaxPctById(taxMap);
      } catch (err) {
        console.error("Error al cargar impuestos", err);
        setTaxPctById({});
      }
    };

    loadLookups();
  }, []);

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
            <select
              className="appearance-none w-[220px] border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base focus:outline-blue-500 focus:outline-2"
              id="categoria"
              name="categoria"
            >
              <option>Categoría</option>
              <option>Administrador</option>
              <option>Empleado</option>
            </select>

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
          <div className="p-6">Cargando…</div>
        ) : (
          <ProductTable
            products={currentProducts}
            headers={headers}
            onEdit={openEdit}
            onDelete={handleDelete}
            categoryNameById={categoryNameById}
            taxPctById={taxPctById}
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
