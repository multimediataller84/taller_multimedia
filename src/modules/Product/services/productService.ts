import { TGetAllOptions } from "../../../models/types/TGetAllOptions";
import apiClient from "../../Login/interceptors/apiClient";
import { IProductService } from "../models/interfaces/IProductService";
import { TCategoryEndpoint } from "../models/types/TCategoryEndpoint";
import { TGetAllPagination } from "../models/types/TGetAllPagination";
import type { TProduct } from "../models/types/TProduct";
import type { TProductEndpoint } from "../models/types/TProductEndpoint";
import { TGetAllPaginationTaxes } from "../models/types/TGetAllPaginationTaxes";
import type { TUnitMeasure } from "../models/types/TUnitMeasure";

type AnyResp = any;

function unwrap<T>(res: AnyResp): T {
  if (!res) return res as T;
  if (res.data?.data) return res.data.data as T;
  if (res.data?.rows) return res.data.rows as T;
  if (res.data) return res.data as T;
  return res as T;
}

export class ProductService implements IProductService {
  public static instance: ProductService;

  static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  get = async (id: number): Promise<TProductEndpoint> => {
    try {
      const response = await apiClient.get<TProductEndpoint>(`/product/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  };

  getAll = async (options: TGetAllOptions): Promise<TGetAllPagination> => {
    try {
      const response = await apiClient.post<TGetAllPagination>(`/product/all`, options);
      return response.data;
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  };

  getAllCategories = async (): Promise<TCategoryEndpoint[]> => {
    try {
      const response = await apiClient.get<TCategoryEndpoint[]>(`/category/all`);
      return response.data;
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  };

  //  Unidades de medida
  getAllMeasure = async (): Promise<TUnitMeasure[]> => {
    try {
      const res = await apiClient.get(`/product/measure/all`);
      return unwrap<TUnitMeasure[]>(res);
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  };

  //  Impuestos (con tolerancia a distintas rutas / formatos del back)
  getAllTaxes = async (options: TGetAllOptions): Promise<TGetAllPaginationTaxes> => {
    const trySeq = [
      async () => apiClient.post(`/tax/all`, options),
      async () => apiClient.get(`/tax/all`, { params: options as Record<string, any> }),
      async () => apiClient.post(`/product/tax/all`, options),
      async () => apiClient.get(`/product/tax/all`, { params: options as Record<string, any> }),
    ];

    let lastErr: any = null;
    for (let i = 0; i < trySeq.length; i++) {
      try {
        const res = await trySeq[i]();
        const raw = unwrap<any>(res);

        if (Array.isArray(raw?.data)) {
          return { data: raw.data, total: Number(raw.total ?? raw.data.length) };
        }
        if (Array.isArray(raw)) {
          return { data: raw, total: raw.length };
        }
        if (raw?.data && typeof raw.total !== "number") {
          return { data: raw.data, total: raw.data.length };
        }
        if (raw?.data && typeof raw.total === "number") {
          return { data: raw.data, total: raw.total };
        }
        if (Array.isArray(raw?.rows)) {
          return { data: raw.rows, total: Number(raw.count ?? raw.rows.length) };
        }

        return { data: [], total: 0 };
      } catch (err: any) {
        lastErr = err;
        if (import.meta.env.MODE !== "production") {
          console.warn(`[getAllTaxes] intento ${i + 1} falló`, err?.response?.status, err?.message);
        }
      }
    }

    throw new Error(`error: ${lastErr}`);
  };

  post = async (data: TProduct): Promise<TProductEndpoint> => {
    try {
      const response = await apiClient.post<TProductEndpoint>(`/product`, data);
      return response.data;
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  };

  patch = async (id: number, data: TProduct): Promise<TProductEndpoint> => {
    try {
      const response = await apiClient.patch<TProductEndpoint>(`/product/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  };

  delete = async (id: number): Promise<TProductEndpoint> => {
    try {
      const response = await apiClient.delete<TProductEndpoint>(`/product/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  };
}
