import { ProfileRepository } from "../../repositories/profileRepository";
import { TUser } from "../types/TUser";

export class PatchUseCase {
  constructor(private repository: ProfileRepository) {}

  async execute(id: number, data: TUser) {
    return this.repository.patch(id, data);
  }
}
