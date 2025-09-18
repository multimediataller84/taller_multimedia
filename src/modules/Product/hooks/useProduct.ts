import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { productRepository } from "../repositories/productRepository";
import type { TProduct } from "../models/types/TProduct";
import type { TProductEndpoint } from "../models/types/TProductEndpoint";

// Debounce simple
function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

const TAX_LIMIT = 10;

export const useProduct = () => {
  const [products, setProducts] = useState<TProductEndpoint[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Opciones para selects
  const [options, setOptions] = useState({
    categories: [] as Array<{ id: number; name: string }>,
    taxes: [] as Array<{ id: number; name: string; percentage: number }>, // compat (primera página)
  });

  // ===== Productos =====
  const fetchProducts = async () => {
  setLoading(true);
  try {
    const { data } = await productRepository.searchProducts({
      description: query || "",
      limit: 10,
      offset: 0,
      orderBy: "product_name",
      orderDirection: "ASC",
    });
    setProducts(data ?? []);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("[Products] listar falló:", err.response?.status, err.response?.data);
    } else {
      console.error("[Products] listar falló:", err);
    }
    setProducts([]);
  } finally {
    setLoading(false);
  }
};

  // ===== Categorías (normal) =====
  const fetchCategories = async () => {
    const cats = await productRepository.getCategories();
    setOptions(prev => ({
      ...prev,
      categories: cats.map((c: any) => ({ id: c.id, name: c.name })),
    }));
  };

  // ===== Impuestos (paginado + filtro + debounce) =====
  const [taxQuery, setTaxQuery] = useState("");
  const debouncedTaxQuery = useDebounce(taxQuery, 400);
  const [taxResults, setTaxResults] = useState<Array<{ id: number; name: string; percentage: number }>>([]);
  const [taxOffset, setTaxOffset] = useState(0);
  const [taxTotal, setTaxTotal] = useState<number | null>(null);
  const [taxLoading, setTaxLoading] = useState(false);

  const fetchTaxes = async ({ reset }: { reset: boolean }) => {
    setTaxLoading(true);
    try {
      const res = await productRepository.searchTaxes({
        description: debouncedTaxQuery || undefined,
        limit: TAX_LIMIT,
        offset: reset ? 0 : taxOffset,
        orderBy: "id",
        orderDirection: "ASC",
      });

      const pageItems = res?.data ?? [];
      if (reset) {
        setTaxResults(pageItems);
        setTaxOffset(pageItems.length);
        // compat: poblar options.taxes con la primera página
        setOptions(prev => ({ ...prev, taxes: pageItems }));
      } else {
        setTaxResults(prev => [...prev, ...pageItems]);
        setTaxOffset(prev => prev + pageItems.length);
      }
      setTaxTotal(res?.total ?? null);
    } finally {
      setTaxLoading(false);
    }
  };

  // Rebuscar cuando cambia el texto (con debounce)
  useEffect(() => {
    fetchTaxes({ reset: true });
  }, [debouncedTaxQuery]);

  const loadMoreTaxes = () => {
    const hasMore =
      taxTotal == null ? taxResults.length % TAX_LIMIT === 0 : taxResults.length < taxTotal;
    if (!taxLoading && hasMore) fetchTaxes({ reset: false });
  };

  // ===== Importar Excel (impuestos) y refrescar =====
  const importTaxesFromFile = async (file: File) => {
    await productRepository.importTaxesFromExcel(file); // POST /admin/data/process/exel
    setTaxQuery("");                                    // limpia filtro
    await fetchTaxes({ reset: true });                  // refresca select (primera página)
  };

  // ===== CRUD Product =====
  const createProduct = async (payload: TProduct) => {
    await productRepository.createProduct(payload);
    await fetchProducts();
  };
  const updateProduct = async (id: number, payload: TProduct) => {
    await productRepository.updateProduct(id, payload);
    await fetchProducts();
  };
  const deleteProduct = async (id: number) => {
    await productRepository.deleteProduct(id);
    await fetchProducts();
  };

  // SKU local (sin verificación, como acordamos)
  const generateSku = (seed?: { product_name?: string; category_id?: string | number }) => {
    const norm = (s: string) => s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
    const slug =
      (seed?.product_name
        ? norm(seed.product_name).replace(/[^a-zA-Z0-9]+/g, "").toUpperCase().slice(0, 3)
        : "PRD") || "PRD";
    const cat = seed?.category_id != null ? String(seed.category_id).padStart(2, "0") : "00";
    const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
    return `${slug}-${cat}-${rand}`;
  };

  // Filtro local de la tabla de productos
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(p =>
      [p.product_name, p.sku, String(p.category_id), String(p.tax_id), p.state]
        .some(v => String(v ?? "").toLowerCase().includes(q))
    );
  }, [products, query]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return {
    // productos
    products: filtered,
    loading,
    query,
    setQuery,
    createProduct: (p: TProduct) => productRepository.createProduct(p).then(fetchProducts),
    updateProduct: (id: number, p: TProduct) => productRepository.updateProduct(id, p).then(fetchProducts),
    deleteProduct: (id: number) => productRepository.deleteProduct(id).then(fetchProducts),
    refetch: fetchProducts,

    // selects
    options,            // categories + taxes (primera página, compat)
    refetchOptions: async () => { await fetchCategories(); await fetchTaxes({ reset: true }); },

    // impuestos con búsqueda paginada (para el modal)
    taxSearch: {
      query: taxQuery,
      setQuery: setTaxQuery,
      results: taxResults,
      loading: taxLoading,
      hasMore: taxTotal == null ? taxResults.length % TAX_LIMIT === 0 : taxResults.length < taxTotal,
      loadMore: loadMoreTaxes,
    },

    // excel -> backend -> refrescar impuestos
    importTaxesFromFile,

    // utilidades
    generateSku,
  };
};