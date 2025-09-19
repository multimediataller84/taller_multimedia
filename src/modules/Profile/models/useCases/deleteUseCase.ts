import { ProfileRepository } from "../../repositories/profileRepository";

export class DeleteUseCase {
  constructor(private repository: ProfileRepository) {}

  async execute(id: number) {
    return this.repository.delete(id);
  }
}
