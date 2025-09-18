import { productService, categoryService, taxService, type ProductSearchPayload } from "../services/productService";
import type { TProduct } from "../models/types/TProduct";
import type { TProductEndpoint } from "../models/types/TProductEndpoint";
import { processDataService, } from "../../../shared/services/processDataService";

// si exportaste este tipo desde services, impórtalo; si no, define aquí el payload:
export type TaxSearchPayload = {
  description?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
};

export const productRepository = {
  // Products
  getProducts: (): Promise<TProductEndpoint[]> => productService.getAll(),
  searchProducts: (p: ProductSearchPayload) => productService.search(p),
  getProduct: (id: number): Promise<TProductEndpoint> => productService.getById(id),
  createProduct: (p: TProduct): Promise<TProductEndpoint> => productService.create(p),
  updateProduct: (id: number, p: TProduct): Promise<TProductEndpoint> => productService.update(id, p),
  deleteProduct: (id: number): Promise<TProductEndpoint> => productService.delete(id),

  // Categories (normal)
  getCategories: () => categoryService.getAll(),

  // Taxes
  // ✅ Nueva búsqueda paginada + filtro (usa POST /product/tax/all o /product/tax con fallback)
  searchTaxes: (payload: TaxSearchPayload) => taxService.search(payload),

  // (Opcional) Compat: traer todos si el back lo soporta
  getTaxes: () => taxService.getAll(),

  // Excel -> proceso en el back
  importTaxesFromExcel: (file: File) => processDataService.postProcessExcel(file),
};