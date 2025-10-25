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
  const productosPerPage = 8;

  const [searchProducts, setSearchProducts] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const textFiltered = products.filter((c) => {
    const findProduct = `${c.category_id} ${c.product_name} ${c.id}`.toLowerCase();
    return findProduct.includes(searchProducts.toLowerCase());
  });

  const filteredProducts = textFiltered.filter((c) => {
    if (!categoryFilter) return true;
    return String(c.category_id) === String(categoryFilter);
  });

  const indexOfLastProduct = activePage * productosPerPage;
  const indexOfFirsProduct = indexOfLastProduct - productosPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirsProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productosPerPage);
  const canPrev = activePage > 1;
  const canNext = activePage < totalPages;

  const goPrev = () => { if (canPrev) setActivePage(activePage - 1); };
  const goNext = () => { if (canNext) setActivePage(activePage + 1); };

  const getPagesDisplay = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (activePage <= 3) pages.push(1, 2, 3, "...", totalPages);
      else if (activePage >= totalPages - 2) pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      else pages.push(1, "...", activePage - 1, activePage, activePage + 1, "...", totalPages);
    }
    return pages;
  };

  const pagesDisplay = getPagesDisplay();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const list = await useCases.getAll.execute({
        limit: 250,
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

  useEffect(() => {
    setActivePage(1);
  }, [categoryFilter]);

  const openCreate = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  const openEdit = (row: TProductEndpoint) => {
    setEditing(row);
    setIsModalOpen(true);
  };

  const handleDelete = async (row: TProductEndpoint) => {
    deleteProduct(row.id);
  };

  const headers = useMemo(
    () => [
      { key: "product_name", label: "Nombre" },
      { key: "sku", label: "SKU" },
      { key: "category_id", label: "Cat. ID" },
      { key: "tax_id", label: "Impuesto ID" },
      { key: "profit_margin", label: "Margen" },
      { key: "unit_price", label: "Precio" },
      { key: "sell_price", label: "Precio de venta" },
      { key: "stock", label: "Stock" },
      { key: "state", label: "Estado" },
    ],
    []
  );

  return {
    searchProducts, setSearchProducts,
    loading, query, setQuery,
    fetchProducts,
    isModalOpen, editing, setIsModalOpen,
    openCreate, openEdit, handleDelete,
    activePage, setActivePage,
    currentProducts, headers,

    totalPages, canPrev, canNext, goPrev, goNext, pagesDisplay,

    categoryFilter, setCategoryFilter,
  };
}
