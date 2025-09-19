import { DeleteUseCase } from "../useCases/deleteUseCase";
import { GetAllUseCase } from "../useCases/getAllUseCase";
import { GetUseCase } from "../useCases/getUseCase";
import { PatchUseCase } from "../useCases/patchUseCase";
import { PostUseCase } from "../useCases/postUseCase";

export type TUseCasesController = {
  get: GetUseCase;
  getAll: GetAllUseCase;
  post: PostUseCase;
  patch: PatchUseCase;
  delete: DeleteUseCase;
}
