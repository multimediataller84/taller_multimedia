import { TUseCasesController } from "../models/types/TUseCasesController";
import { DeleteUseCase } from "../models/useCases/deleteUseCase";
import { GetAllUseCase } from "../models/useCases/getAllUseCase";
import { GetUseCase } from "../models/useCases/getUseCase";
import { PatchUseCase } from "../models/useCases/patchUseCase";
import { PostUseCase } from "../models/useCases/postUseCase";
import { ProfileRepository } from "../repositories/profileRepository";

export class UseCasesController implements TUseCasesController {
  get: GetUseCase;
  getAll: GetAllUseCase;
  post: PostUseCase;
  patch: PatchUseCase;
  delete: DeleteUseCase;

  constructor(private readonly repository: ProfileRepository) {
    this.get = new GetUseCase(this.repository);
    this.getAll = new GetAllUseCase(this.repository);
    this.post = new PostUseCase(this.repository);
    this.patch = new PatchUseCase(this.repository);
    this.delete = new DeleteUseCase(this.repository);
  }
}
/* UseHook
const repository = ProfileRepository.getInstance()
const useCasesController  = new UseCasesController(repository)

useCasesController.get.execute(id)
useCasesController.post.execute(data)

*/
