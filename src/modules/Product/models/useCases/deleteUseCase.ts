import { ProductRepository } from "../../repositories/productRepository";

export class DeleteUseCase {
  constructor(private repository: ProductRepository) {}

  async execute(id: number) {
    return this.repository.delete(id);
  }
}
