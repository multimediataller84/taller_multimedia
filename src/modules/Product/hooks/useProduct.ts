import { useState, useEffect, useMemo } from "react";
import { productRepository } from "../repositories/productRepository";
import type { TProduct } from "../models/types/TProduct";
import type { TProductEndpoint } from "../models/types/TProductEndpoint";

export const useProduct = () => {
  const [products, setProducts] = useState<TProductEndpoint[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({
    categories: [] as Array<{ id: number; name: string }>,
    taxes: [] as Array<{ id: number; name: string; percentage: number }>,
  });

  const fetchProducts = async () => {
    setLoading(true);
    try { setProducts(await productRepository.getProducts()); }
    finally { setLoading(false); }
  };

  const fetchOptions = async () => {
    const [cats, taxes] = await Promise.all([
      productRepository.getCategories(),
      productRepository.getTaxes(),
    ]);
    setOptions({
      categories: cats.map((c: any) => ({ id: c.id, name: c.name })),
      taxes: taxes.map((t: any) => ({ id: t.id, name: t.name, percentage: t.percentage })),
    });
  };

  const importTaxesFromFile = async (file: File) => {
    await productRepository.importTaxesFromExcel(file);
    await fetchOptions();
  };

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

//Hay que verificar que el sku no esté repetido
  const generateSku = (seed?: { product_name?: string; category_id?: string | number }) => {
    const norm = (s: string) => s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
    const slug = (seed?.product_name
        ? norm(seed.product_name).replace(/[^a-zA-Z0-9]+/g, "").toUpperCase().slice(0, 3)
        : "PRD") || "PRD";
    const cat = seed?.category_id != null ? String(seed.category_id).padStart(2, "0") : "00";
    const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
    return `${slug}-${cat}-${rand}`;
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(p =>
      [p.product_name, p.sku, String(p.category_id), String(p.tax_id), p.state]
        .some(v => String(v ?? "").toLowerCase().includes(q))
    );
  }, [products, query]);

  useEffect(() => { fetchProducts(); fetchOptions(); }, []);

  return {
    products: filtered, loading, query, setQuery,
    createProduct: (p: TProduct) => productRepository.createProduct(p).then(fetchProducts),
    updateProduct: (id: number, p: TProduct) => productRepository.updateProduct(id, p).then(fetchProducts),
    deleteProduct: (id: number) => productRepository.deleteProduct(id).then(fetchProducts),
    refetch: fetchProducts,
    options,
    refetchOptions: fetchOptions,
    importTaxesFromFile,
    generateSku,
  };
};
