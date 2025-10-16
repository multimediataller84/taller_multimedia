import { DeleteUseCase } from "../useCases/deleteUseCase";
import { GetAllCategoriesUseCase } from "../useCases/getAllCategoriesUseCase";
import { GetAllUseCase } from "../useCases/getAllUseCase";
import { GetUseCase } from "../useCases/getUseCase";
import { PatchUseCase } from "../useCases/patchUseCase";
import { PostUseCase } from "../useCases/postUseCase";
import { GetAllMeasureUseCase } from "../useCases/getAllMeasureUseCase";

export type TUseCasesController = {
  get: GetUseCase;
  getAll: GetAllUseCase;
  getAllCategories: GetAllCategoriesUseCase;
  getAllMeasure: GetAllMeasureUseCase;
  post: PostUseCase;
  patch: PatchUseCase;
  delete: DeleteUseCase;
};
