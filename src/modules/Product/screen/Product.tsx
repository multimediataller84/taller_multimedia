// Product.tsx
import { useState } from "react";
import { useProduct } from "../hooks/useProduct";
import { ProductFormModal } from "../components/ProductFormModal";
import { Sidebar } from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar'; // Importa la SearchBar
import { IProduct } from "../models/interfaces/IProduct";

export const Product = () => {
  const { products, createProduct, updateProduct, deleteProduct, searchProducts } = useProduct(); // Importa searchProducts
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<IProduct | null>(null);

  const handleOpenNew = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: IProduct) => {
    setEditData(product);
    setIsModalOpen(true);
  };

  const handleSave = async (product: IProduct) => {
    if (product.id) {
      await updateProduct(product.id, product);
    } else {
      await createProduct(product);
    }
  };

  // Manejador de búsqueda
  const handleSearch = (query: string) => {
    searchProducts(query);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <div className="bg-white p-4 flex justify-between items-center shadow-md">
          <SearchBar onSearch={handleSearch} placeholder="Buscar productos..." />
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-xl">🔔</span>
            <span
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-1 rounded"
              onClick={() => navigate('/perfiles')}
            >
              <span className="w-8 h-8 rounded-full bg-gray-300"></span>
              Administrador
            </span>
          </div>
        </div>

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
              {products.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">₡{p.basePrice}</td>
                  <td className="p-2">{p.stock}</td>
                  <td className="p-2">₡{p.cost}</td>
                  <td className="p-2 flex gap-2">
                    <button className="text-blue-500" onClick={() => handleEdit(p)}>✏️</button>
                    <button className="text-red-500" onClick={() => deleteProduct(p.id!)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ProductFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            initialData={editData}
          />
        </div>
      </div>
    </div>
  );
};