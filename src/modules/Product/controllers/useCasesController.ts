import { TUseCasesController } from "../models/types/TUseCasesController";
import { DeleteUseCase } from "../models/useCases/deleteUseCase";
import { GetAllCategoriesUseCase } from "../models/useCases/getAllCategoriesUseCase";
import { GetAllTaxesUseCase } from "../models/useCases/getAllTaxesUseCase";
import { GetAllUseCase } from "../models/useCases/getAllUseCase";
import { GetUseCase } from "../models/useCases/getUseCase";
import { PatchUseCase } from "../models/useCases/patchUseCase";
import { PostUseCase } from "../models/useCases/postUseCase";
import { ProductRepository } from "../repositories/productRepository";
import { GetAllMeasureUseCase } from "../models/useCases/getAllMeasureUseCase";

export class UseCasesController implements TUseCasesController {
  get: GetUseCase;
  getAll: GetAllUseCase;
  getAllCategories: GetAllCategoriesUseCase;
  getAllTaxes: GetAllTaxesUseCase;
  getAllMeasure: GetAllMeasureUseCase;
  post: PostUseCase;
  patch: PatchUseCase;
  delete: DeleteUseCase;

  constructor(private readonly repository: ProductRepository) {
    this.get = new GetUseCase(this.repository);
    this.getAll = new GetAllUseCase(this.repository);
    this.getAllCategories = new GetAllCategoriesUseCase(this.repository);
    this.getAllTaxes = new GetAllTaxesUseCase(this.repository);
    this.getAllMeasure = new GetAllMeasureUseCase(this.repository);
    this.post = new PostUseCase(this.repository);
    this.patch = new PatchUseCase(this.repository);
    this.delete = new DeleteUseCase(this.repository);
  }
}
