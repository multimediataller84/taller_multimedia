import { TGetAllOptions } from "../../../../models/types/TGetAllOptions";
import { ProductRepository } from "../../repositories/productRepository";

export class GetAllUseCase {
  constructor(private repository: ProductRepository) {}

  async execute(options: TGetAllOptions) {
    return this.repository.getAll(options);
  }
}
