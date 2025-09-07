// Product.tsx
import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../../ClientsModule/components/navbar"
import { ProductFormModal } from "../components/ProductFormModal";
import { IProduct } from "../models/interfaces/IProduct";
import {
  loadProducts as loadLocalProducts,
  saveProducts as saveLocalProducts,
  deleteProduct as deleteLocalProduct,
} from "../../../storage/productsLocal";

export const Product = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<IProduct | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    // lee del “JSON local”
    let list = loadLocalProducts() as unknown as IProduct[];

    // normalizar: si hay items sin id (de datos viejos), se lo asignamos y persistimos
    let mutated = false;
    list = list.map((p, i) => {
      if ((p as any).id == null) {
        mutated = true;
        return { ...p, id: Date.now() + i } as any; // id:number
      }
      return p;
    });
    if (mutated) saveLocalProducts(list as any);

    setProducts(list);
  };

  const handleOpenNew = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: IProduct) => {
    setEditData(product);
    setIsModalOpen(true);
  };

  // el modal ya agrega/actualiza; aqui solo refrescamos
  const handleSave = () => {
    refresh();
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Eliminar este producto?")) {
      deleteLocalProduct(id);
      refresh();
    }
  };

  const handleSearch = (q: string) => setQuery(q);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, (p as any).category, String(p.basePrice), String(p.cost), String(p.stock)]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [products, query]);

  return (
    <div className="flex absolute bg-amber-300 size-full">

      <section className="bg-red-500 size-full flex flex-col">
      <div>
        <Navbar></Navbar>
      </div>
      
      <div className="flex">
        <Sidebar></Sidebar>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Productos</h1>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleOpenNew}
            >
              + Nuevo producto
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2">Producto</th>
                  <th className="p-2">Precio base</th>
                  <th className="p-2">Stock</th>
                  <th className="p-2">Costo producto</th>
                  <th className="p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td className="p-4 text-gray-500" colSpan={5}>
                      {query ? "No hay resultados para la búsqueda." : "No hay productos guardados localmente."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={(p as any).id ?? p.name} className="border-t">
                      <td className="p-2">{p.name}</td>
                      <td className="p-2">₡{p.basePrice}</td>
                      <td className="p-2">{p.stock}</td>
                      <td className="p-2">₡{p.cost}</td>
                      <td className="p-2 flex gap-2">
                        <button className="text-blue-500" onClick={() => handleEdit(p)}>✏️</button>
                        <button className="text-red-500" onClick={() => handleDelete((p as any).id as number)}>🗑️</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <ProductFormModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditData(null);
              refresh(); // por si el modal guardó
            }}
            onSave={handleSave}
            initialData={editData}
          />
        </div>
      </div>
    


      </section>
      
      
    </div>
  );
};



/*

<div className="flex">
       <Sidebar />

        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Productos</h1>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleOpenNew}
            >
              + Nuevo producto
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2">Producto</th>
                  <th className="p-2">Precio base</th>
                  <th className="p-2">Stock</th>
                  <th className="p-2">Costo producto</th>
                  <th className="p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td className="p-4 text-gray-500" colSpan={5}>
                      {query ? "No hay resultados para la búsqueda." : "No hay productos guardados localmente."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={(p as any).id ?? p.name} className="border-t">
                      <td className="p-2">{p.name}</td>
                      <td className="p-2">₡{p.basePrice}</td>
                      <td className="p-2">{p.stock}</td>
                      <td className="p-2">₡{p.cost}</td>
                      <td className="p-2 flex gap-2">
                        <button className="text-blue-500" onClick={() => handleEdit(p)}>✏️</button>
                        <button className="text-red-500" onClick={() => handleDelete((p as any).id as number)}>🗑️</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <ProductFormModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditData(null);
              refresh(); // por si el modal guardó
            }}
            onSave={handleSave}
            initialData={editData}
          />
        </div>
      </div>

*/