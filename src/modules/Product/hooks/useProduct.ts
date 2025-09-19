import { useEffect, useState } from "react";
import { ProductRepository } from "../repositories/productRepository";
import { UseCasesController } from "../controllers/useCasesController";
import { TProductEndpoint } from "../models/types/TProductEndpoint";

const repository = ProductRepository.getInstance();
const useCases = new UseCasesController(repository);

export function useProduct() {
  const [products, setProducts] = useState<TProductEndpoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const list = await useCases.getAll.execute({
        limit: 10,
        offset: 0,
        orderDirection: "ASC"
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
  /*
  const importTaxesFromFile = async (file: File) => {
    await useCases.importTaxes.execute(file);
  };
*/
  useEffect(() => {
    fetchProducts();
  }, [query]);

  return {
    products,
    loading,
    query,
    setQuery,
    deleteProduct,
    fetchProducts
    /*  importTaxesFromFile,*/
  };
}
