import { ProfileRepository } from "../../repositories/profileRepository";

export class GetUseCase {
  constructor(private repository: ProfileRepository) {}

  async execute(id: number) {
    return this.repository.get(id);
  }
}
