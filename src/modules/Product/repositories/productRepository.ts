import { productService } from "../services/productService";

export const productRepository = {
  getProducts: () => productService.getAll(),
  createProduct: (product: any) => productService.create(product),
  updateProduct: (id: number, product: any) => productService.update(id, product),
  deleteProduct: (id: number) => productService.delete(id),
  searchProducts: (query: string) => productService.search(query),
};
