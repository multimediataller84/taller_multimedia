import { ProductRepository } from "../../repositories/productRepository";

export class GetUseCase {
  constructor(private repository: ProductRepository) {}

  async execute(id: number) {
    return this.repository.get(id);
  }
}
