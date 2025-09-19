import { DeleteUseCase } from "../useCases/deleteUseCase";
import { GetAllCategoriesUseCase } from "../useCases/getAllCategoriesUseCase";
import { GetAllUseCase } from "../useCases/getAllUseCase";
import { GetUseCase } from "../useCases/getUseCase";
import { PatchUseCase } from "../useCases/patchUseCase";
import { PostUseCase } from "../useCases/postUseCase";

export type TUseCasesController = {
  get: GetUseCase;
  getAll: GetAllUseCase;
  getAllCategories: GetAllCategoriesUseCase;
  post: PostUseCase;
  patch: PatchUseCase;
  delete: DeleteUseCase;
}
