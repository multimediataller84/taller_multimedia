import { useEffect, useMemo, useState } from "react";
import { ProductRepository } from "../repositories/productRepository";
import { UseCasesController } from "../controllers/useCasesController";
import { TProductEndpoint } from "../models/types/TProductEndpoint";

const repository = ProductRepository.getInstance();
const useCases = new UseCasesController(repository);

export function useProduct() {
  const [products, setProducts] = useState<TProductEndpoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<TProductEndpoint | null>(null);

  const [activePage, setActivePage] = useState(1);
  const productosPerPage = 10;

  const [searchProducts, setSearchProducts] = useState("");
  const filteredProducts = products.filter((c) => {
    const findProduct = `${c.category_id} ${c.product_name} ${c.id}`.toLowerCase();
    return findProduct.includes(searchProducts.toLowerCase());
  });

  const indexOfLastProduct = activePage * productosPerPage;
  const indexOfFirsProduct = indexOfLastProduct - productosPerPage;
  
  const currentProducts = filteredProducts.slice(
    indexOfFirsProduct,
    indexOfLastProduct
  );


  const fetchProducts = async () => {
    setLoading(true);
    try {
      const list = await useCases.getAll.execute({
        limit: 50,
        offset: 0,
        orderDirection: "ASC",
      });
      setProducts(list.data);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    await useCases.delete.execute(id);
    await fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, [query]);

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

  return {
    searchProducts,
    setSearchProducts,
    loading,
    query,
    setQuery,
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
  };
}
