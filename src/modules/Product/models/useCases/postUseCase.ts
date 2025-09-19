import { ProductRepository } from "../../repositories/productRepository";
import type { TProduct } from "../types/TProduct";

export class PostUseCase {
  constructor(private repository: ProductRepository) {}

  async execute(data: TProduct) {
    return this.repository.post(data);
  }
}
