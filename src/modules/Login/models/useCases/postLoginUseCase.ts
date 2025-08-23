import { LoginRepository } from "../../repositories/loginRepository";
import { TLogin } from "../types/TLogin";

export class PostLoginUseCase {
  constructor(private loginRepository: LoginRepository) {}

  async execute(data: TLogin) {
    return await this.loginRepository.login(data);
  }
}
