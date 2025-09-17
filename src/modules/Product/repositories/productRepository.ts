import { productService, categoryService, taxService } from "../services/productService";
import type { TProduct } from "../models/types/TProduct";
import type { TProductEndpoint } from "../models/types/TProductEndpoint";
import { processDataService } from "../../../shared/services/processDataService";

export const productRepository = {
  getProducts: (): Promise<TProductEndpoint[]> => productService.getAll(),
  getProduct: (id: number): Promise<TProductEndpoint> => productService.getById(id),
  createProduct: (p: TProduct): Promise<TProductEndpoint> => productService.create(p),
  updateProduct: (id: number, p: TProduct): Promise<TProductEndpoint> => productService.update(id, p),
  deleteProduct: (id: number): Promise<TProductEndpoint> => productService.delete(id),

  getCategories: () => categoryService.getAll(),
  getTaxes: () => taxService.getAll(),

  importTaxesFromExcel: (file: File) => processDataService.postProcessExcel(file),
};