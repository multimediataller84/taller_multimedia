import { ProfileRepository } from "../../repositories/profileRepository";

export class GetAllUseCase {
  constructor(private repository: ProfileRepository) {}

  async execute() {
    return this.repository.getAll();
  }
}
