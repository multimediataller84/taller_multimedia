import { ProductRepository } from "../../repositories/productRepository";
import type { TUnitMeasure } from "../types/TUnitMeasure";

export class GetAllMeasureUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(): Promise<TUnitMeasure[]> {
    return this.repository.getAllMeasure();
  }
}
