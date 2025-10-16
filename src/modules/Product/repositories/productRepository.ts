import { TGetAllOptions } from "../../../models/types/TGetAllOptions";
import { IProductRepository } from "../models/interfaces/IProductRepository";
import { TCategoryEndpoint } from "../models/types/TCategoryEndpoint";
import { TGetAllPagination } from "../models/types/TGetAllPagination";
import { TGetAllPaginationTaxes } from "../models/types/TGetAllPaginationTaxes";
import type { TProduct } from "../models/types/TProduct";
import type { TProductEndpoint } from "../models/types/TProductEndpoint";
import { ProductService } from "../services/productService";
import { TUnitMeasure } from "../models/types/TUnitMeasure";

export class ProductRepository implements IProductRepository {
  public static instance: ProductRepository;
  private readonly productService = ProductService.getInstance();

  static getInstance(): ProductRepository {
    if (!ProductRepository.instance) {
      ProductRepository.instance = new ProductRepository();
    }
    return ProductRepository.instance;
  }

  async get(id: number): Promise<TProductEndpoint> {
    try {
      const response = await this.productService.get(id);
      return response;
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  }

  async getAll(options: TGetAllOptions): Promise<TGetAllPagination> {
    try {
      const response = await this.productService.getAll(options);
      return response;
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  }

  // Categorías
  getAllCategories = async (): Promise<TCategoryEndpoint[]> => {
    try {
      const response = await this.productService.getAllCategories();
      return response;
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  };

  // Impuestos
  getAllTaxes = async (
    options: TGetAllOptions
  ): Promise<TGetAllPaginationTaxes> => {
    try {
      const response = await this.productService.getAllTaxes(options);
      return response;
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  };

  // Unidades de medida
  getAllMeasure = async (): Promise<TUnitMeasure[]> => {
    try {
      const response = await this.productService.getAllMeasure();
      return response;
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  };

  async post(data: TProduct): Promise<TProductEndpoint> {
    try {
      const response = await this.productService.post(data);
      return response;
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  }

  async patch(id: number, data: TProduct): Promise<TProductEndpoint> {
    try {
      const response = await this.productService.patch(id, data);
      return response;
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  }

  async delete(id: number): Promise<TProductEndpoint> {
    try {
      const response = await this.productService.delete(id);
      return response;
    } catch (error) {
      throw new Error(`error: ${error}`);
    }
  }
}
