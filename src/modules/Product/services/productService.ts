import { api } from "../../../shared/api/apiClient";
import { getWithFallback, postWithFallback } from "../../../shared/api/fallback";
import type { TProduct } from "../models/types/TProduct";
import type { TProductEndpoint } from "../models/types/TProductEndpoint";

const PRODUCT = "/product";
const CATEGORY = "/category";
const TAX = "/product/tax";

export type ProductSearchPayload = {
  description?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
};

function normalize(resp: any) {
  const rows: TProductEndpoint[] = Array.isArray(resp) ? resp : (resp?.data ?? []);
  const total: number = resp?.total ?? rows.length;
  return { data: rows, total };
}

async function listPage(payload: ProductSearchPayload) {
  const { data } = await api.post(`${PRODUCT}/all`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return normalize(data);
}

async function fetchAllSkus(): Promise<string[]> {
  const list = await productService.getAll();
  return list.map(p => (p.sku ?? "").toUpperCase());
}

export const productService = {
  async getAll(): Promise<TProductEndpoint[]> {
    const { data } = await listPage({
      description: "",
      limit: 10,
      offset: 0,
      orderBy: "product_name",
      orderDirection: "ASC",
    });
    return data;
  },

  async search(payload: ProductSearchPayload) {
    return listPage(payload);
  },

  async getById(id: number): Promise<TProductEndpoint> {
    const { data } = await api.get<TProductEndpoint>(`${PRODUCT}/${id}`);
    return data;
  },

  async create(payload: TProduct): Promise<TProductEndpoint> {
    try {
      const { data } = await api.post<TProductEndpoint>(PRODUCT, payload);
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
      const { data } = await api.patch<TProductEndpoint>(`${PRODUCT}/${id}`, payload);
      return data;
    } catch (err: any) {
      if (err?.response?.status === 409) {
        throw new Error("El SKU ya existe. Usa otro código.");
      }
      throw err;
    }
  },

  async delete(id: number): Promise<TProductEndpoint> {
    const { data } = await api.delete<TProductEndpoint>(`${PRODUCT}/${id}`);
    return data;
  },

  fetchAllSkus: async (): Promise<string[]> => {
    const list = await productService.getAll();
    return list.map(p => (p.sku ?? "").toUpperCase());
  },
};

type TCategoryEndpoint = { id: number; name: string; description?: string | null };
type TTaxEndpoint = { id: number; name: string; percentage: number; description?: string | null };

// CATEGORÍAS: fallback /category/all -> /category
export const categoryService = {
  async getAll(): Promise<TCategoryEndpoint[]> {
    return getWithFallback<TCategoryEndpoint[]>([`${CATEGORY}/all`, `${CATEGORY}`]);
  },
};

// IMPUESTOS:
// Back nuevo usa POST paginado a /product/tax/all (o a veces /product/tax).
// Dejo 'search' (recomendado) y 'getAll' (compatibilidad).
export type TaxSearchPayload = {
  description?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
};

export const taxService = {
  // Búsqueda paginada con fallback
  async search(payload: TaxSearchPayload): Promise<{ data: TTaxEndpoint[]; total?: number }> {
    return postWithFallback<{ data: TTaxEndpoint[]; total?: number }>([
      { path: `${TAX}/all`, body: payload }, // opción A (con /all)
      { path: `${TAX}`, body: payload },     // opción B (sin /all)
    ]);
  },

  // Compatibilidad: traer todo (si el back lo permite)
  async getAll(): Promise<TTaxEndpoint[]> {
    return getWithFallback<TTaxEndpoint[]>([`${TAX}/all`, `${TAX}`]);
  },
};