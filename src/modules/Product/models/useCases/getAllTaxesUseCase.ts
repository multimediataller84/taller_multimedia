import { TGetAllOptions } from "../../../../models/types/TGetAllOptions";
import { ProductRepository } from "../../repositories/productRepository";

export class GetAllTaxesUseCase {
  constructor(private repository: ProductRepository) {}

  async execute(options: TGetAllOptions) {
    return this.repository.getAllTaxes(options);
  }
}
