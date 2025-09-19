import { ProductRepository } from "../../repositories/productRepository";
import { TProduct } from "../types/TProduct";

export class PatchUseCase {
  constructor(private repository: ProductRepository) {}

  async execute(id: number, data: TProduct) {
    return this.repository.patch(id, data);
  }
}
