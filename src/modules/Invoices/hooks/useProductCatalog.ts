import { useCallback, useEffect, useMemo, useState } from "react";
import { ProductRepository } from "../../Product/repositories/productRepository";
import { UseCasesController } from "../../Product/controllers/useCasesController";
import type { TProductEndpoint } from "../../Product/models/types/TProductEndpoint";

const repository = ProductRepository.getInstance();
const useCases = new UseCasesController(repository);

export const useProductCatalog = () => {
  const [products, setProducts] = useState<TProductEndpoint[]>([]);
  const [searchResults, setSearchResults] = useState<TProductEndpoint[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const list = await useCases.getAll.execute({ limit: 100, offset: 0, orderDirection: "ASC" });
      setProducts(list.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debounce the query to avoid excessive requests
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  // When there is a query, perform a server-side search using description
  useEffect(() => {
    const run = async () => {
      if (!debouncedQuery) {
        setSearchResults(null);
        return;
      }
      setLoading(true);
      try {
        const list = await useCases.getAll.execute({ description: debouncedQuery, limit: 100, offset: 0, orderDirection: "ASC" });
        setSearchResults(list.data);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [debouncedQuery]);

  const base = searchResults ?? products;
  const productsInStock = useMemo(() => base.filter((p) => p.stock > 0), [base]);

  const filtered = useMemo(() => {
    // If we have server results (searchResults), they are already filtered by description on the backend.
    // We still keep client-side filtering for local-only mode (no query) just in case.
    if (!query.trim()) return productsInStock;
    if (searchResults) return productsInStock;
    const q = query.toLowerCase();
    return productsInStock.filter((p) =>
      `${p.product_name} ${p.sku} ${p.tax?.percentage ?? ''}%`.toLowerCase().includes(q)
    );
  }, [productsInStock, query, searchResults]);

  return {
    loading,
    query,
    setQuery,
    products: filtered,
    refetch: fetchProducts,
  };
};
