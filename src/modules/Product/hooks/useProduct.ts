import { useState, useEffect } from "react";
import { productRepository } from "../repositories/productRepository";

export const useProduct = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await productRepository.getProducts();
    setProducts(data);
    setLoading(false);
  };

  const createProduct = async (product: any) => {
    await productRepository.createProduct(product);
    fetchProducts();
  };

  const updateProduct = async (id: number, product: any) => {
    await productRepository.updateProduct(id, product);
    fetchProducts();
  };

  const deleteProduct = async (id: number) => {
    await productRepository.deleteProduct(id);
    fetchProducts();
  };

  const searchProducts = async (query: string) => {
    const results = await productRepository.searchProducts(query);
    setProducts(results);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, createProduct, updateProduct, deleteProduct, searchProducts };
};
