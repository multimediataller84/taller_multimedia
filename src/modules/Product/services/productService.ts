import axios from "axios";
import type { TProduct } from "../models/types/TProduct";
import type { TProductEndpoint } from "../models/types/TProductEndpoint";

const baseUrl = import.meta.env.VITE_API_URL + "/product";

async function fetchAllSkus(): Promise<string[]> {
  const list = await productService.getAll();
  return list.map(p => (p.sku ?? "").toUpperCase());
}

export const productService = {
  async getAll(): Promise<TProductEndpoint[]> {
    const { data } = await axios.get(`${baseUrl}/all`);
    return data;
  },
  async getById(id: number): Promise<TProductEndpoint> {
    const { data } = await axios.get(`${baseUrl}/${id}`);
    return data;
  },
  async create(payload: TProduct): Promise<TProductEndpoint> {
      try {
      const { data } = await axios.post(baseUrl, payload);
      return data;
    } catch (err: any) {
      if (err?.response?.status === 409) {
        throw new Error("El SKU ya existe. Usa otro código.");
      }
      throw err;
    }
  },
  async update(id: number, payload: TProduct): Promise<TProductEndpoint> {
    try {
      const { data } = await axios.patch(`${baseUrl}/${id}`, payload);
      return data;
    } catch (err: any) {
      if (err?.response?.status === 409) {
        throw new Error("El SKU ya existe. Usa otro código.");
      }
      throw err;
    }
  },
  async delete(id: number): Promise<TProductEndpoint> {
    const { data } = await axios.delete(`${baseUrl}/${id}`);
    return data;
  },
  fetchAllSkus,
};

type TCategoryEndpoint = { id: number; name: string; description?: string | null };
type TTaxEndpoint = { id: number; name: string; percentage: number; description?: string | null };

export const categoryService = {
  async getAll(): Promise<TCategoryEndpoint[]> {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/category/all`);
    return data;
  },
};

export const taxService = {
  async getAll(): Promise<TTaxEndpoint[]> {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/product/tax/all`);
    return data;
  },
};
