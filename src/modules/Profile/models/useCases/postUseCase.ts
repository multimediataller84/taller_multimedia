import { ProfileRepository } from "../../repositories/profileRepository";
import { TUser } from "../types/TUser";

export class PostUseCase {
  constructor(private repository: ProfileRepository) {}

  async execute(data: TUser) {
    return this.repository.post(data);
  }
}
