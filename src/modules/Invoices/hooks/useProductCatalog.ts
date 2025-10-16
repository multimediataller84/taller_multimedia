import { useEffect, useMemo, useState } from "react";
import { ProductRepository } from "../../Product/repositories/productRepository";
import { UseCasesController } from "../../Product/controllers/useCasesController";
import type { TProductEndpoint } from "../../Product/models/types/TProductEndpoint";

const repository = ProductRepository.getInstance();
const useCases = new UseCasesController(repository);

export const useProductCatalog = () => {
  const [products, setProducts] = useState<TProductEndpoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const list = await useCases.getAll.execute({ limit: 100, offset: 0, orderDirection: "ASC" });
      setProducts(list.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const productsInStock = useMemo(() => products.filter((p) => p.stock > 0), [products]);

  const filtered = useMemo(() => {
    if (!query.trim()) return productsInStock;
    const q = query.toLowerCase();
    return productsInStock.filter((p) =>
      `${p.product_name} ${p.sku} ${p.tax?.percentage ?? ''}%`.toLowerCase().includes(q)
    );
  }, [productsInStock, query]);

  return {
    loading,
    query,
    setQuery,
    products: filtered,
    refetch: fetchProducts,
  };
};
