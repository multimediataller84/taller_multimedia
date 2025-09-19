import { ProductRepository } from "../../repositories/productRepository";

export class GetAllCategoriesUseCase {
  constructor(private repository: ProductRepository) {}

  async execute() {
    return this.repository.getAllCategories();
  }
}
