import { TGetAllOptions } from "../../../models/types/TGetAllOptions";
import apiClient from "../../Login/interceptors/apiClient";
import { IProductService } from "../models/interfaces/IProductService";
import { TCategoryEndpoint } from "../models/types/TCategoryEndpoint";
import { TGetAllPagination } from "../models/types/TGetAllPagination";
import type { TProduct } from "../models/types/TProduct";
import type { TProductEndpoint } from "../models/types/TProductEndpoint";
import { TGetAllPaginationTaxes } from "../models/types/TGetAllPaginationTaxes";

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
      throw new Error(`error: ${error}" `);
    }
  };

  getAll = async (options: TGetAllOptions): Promise<TGetAllPagination> => {
    try {
      const response = await apiClient.post<TGetAllPagination>(`/product/all`, options);
      return response.data;
    } catch (error) {
      throw new Error(`error: ${error}" `);
    }
  };

  getAllCategories = async (): Promise<TCategoryEndpoint[]> => {
    try {
      const response = await apiClient.get<TCategoryEndpoint[]>(`/category/all`);
      return response.data;
    } catch (error) {
      throw new Error(`error: ${error}" `);
    }
  };

  getAllTaxes = async (options: TGetAllOptions): Promise<TGetAllPaginationTaxes> => {
    try {
      const response = await apiClient.post<TGetAllPaginationTaxes>(`/product/tax/all`, options);
      return response.data;
    } catch (error) {
      throw new Error(`error: ${error}" `);
    }
  };

  post = async (data: TProduct): Promise<TProductEndpoint> => {
    try {
      const response = await apiClient.post<TProductEndpoint>(`/product`, data);
      return response.data;
    } catch (error) {
      throw new Error(`error: ${error}" `);
    }
  };

  patch = async (id: number, data: TProduct): Promise<TProductEndpoint> => {
    try {
      const response = await apiClient.patch<TProductEndpoint>(
        `/product/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(`error: ${error}" `);
    }
  };

  delete = async (id: number): Promise<TProductEndpoint> => {
    try {
      const response = await apiClient.delete<TProductEndpoint>(
        `/product/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`error: ${error}" `);
    }
  };
}
