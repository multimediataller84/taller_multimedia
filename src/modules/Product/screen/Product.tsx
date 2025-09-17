import { useMemo, useState } from "react";
import { useProduct } from "../hooks/useProduct";
import type { TProduct } from "../models/types/TProduct";
import type { TProductEndpoint } from "../models/types/TProductEndpoint";
import { ProductFormModal } from "../components/ProductFormModal";
import { Sidebar } from "../../../components/Sidebar";
import SearchBar from "../../../components/SearchBar";
import TaxExcelUploader from "../components/TaxExcelUploader";

export default function Product() {
  const {
    products, loading, query, setQuery,
    createProduct, updateProduct, deleteProduct,
    generateSku, options,
    importTaxesFromFile,
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

  const handleSave = async (payload: TProduct) => {
    if (editing) {
      await updateProduct(editing.id, payload);
    } else {
      await createProduct(payload);
    }
  };

  const handleDelete = async (row: TProductEndpoint) => {
    if (confirm(`¿Eliminar producto "${row.product_name}"?`)) {
      await deleteProduct(row.id);
    }
  };

  const fmtCRC = (n: number) =>
    new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC" }).format(
      Number(n || 0)
    );
  const fmtMargin = (m: number) =>
    m <= 1 ? `${(m * 100).toFixed(0)}%` : `${m}%`;

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
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

      <main className="flex-1">
        <SearchBar
          placeholder="Buscar productos..."
          value={query}
          onChange={setQuery}
          username="Administrador"
        />

        <div className="p-6">
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
            <TaxExcelUploader onUpload={importTaxesFromFile} />
          </div>

          {loading ? (
            <div className="p-6">Cargando…</div>
          ) : (
            <div className="overflow-x-auto border rounded bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {headers.map((h) => (
                      <th
                        key={h.key}
                        className="text-left px-3 py-2 font-medium text-gray-700"
                      >
                        {h.label}
                      </th>
                    ))}
                    <th className="px-3 py-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((row) => (
                    <tr key={row.id} className="border-t">
                      <td className="px-3 py-2">{row.product_name}</td>
                      <td className="px-3 py-2">{row.sku}</td>
                      <td className="px-3 py-2">{row.category_id}</td>
                      <td className="px-3 py-2">{row.tax_id}</td>
                      <td className="px-3 py-2">{fmtMargin(row.profit_margin)}</td>
                      <td className="px-3 py-2">{fmtCRC(row.unit_price)}</td>
                      <td className="px-3 py-2">{row.stock}</td>
                      <td className="px-3 py-2">{row.state}</td>
                      <td className="px-3 py-2">
                        <div className="flex justify-end gap-2">
                          <button
                            title="Ver"
                            className="px-2 py-1 rounded border"
                            onClick={() => alert(`Ver ${row.product_name}`)}
                          >
                            👁️
                          </button>
                          <button
                            title="Editar"
                            className="px-2 py-1 rounded border"
                            onClick={() => openEdit(row)}
                          >
                            ✏️
                          </button>
                          <button
                            title="Eliminar"
                            className="px-2 py-1 rounded border text-red-600"
                            onClick={() => handleDelete(row)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {products.length === 0 && (
                    <tr>
                      <td
                        colSpan={headers.length + 1}
                        className="px-3 py-6 text-center text-gray-500"
                      >
                        No hay productos para mostrar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>


              <div className="flex items-center justify-between px-3 py-2 text-xs text-gray-500">
                <span>Mostrando {products.length} resultados</span>
                <div className="flex items-center gap-1">
                  <button className="h-8 w-8 border rounded">◀</button>
                  <button className="h-8 w-8 border rounded">1</button>
                  <button className="h-8 w-8 border rounded">2</button>
                  <span className="px-1">…</span>
                  <button className="h-8 w-8 border rounded">8</button>
                  <button className="h-8 w-8 border rounded">▶</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editing}
        generateSku={generateSku}
        categories={options.categories}
        taxes={options.taxes}
      />
    </div>
  );
}