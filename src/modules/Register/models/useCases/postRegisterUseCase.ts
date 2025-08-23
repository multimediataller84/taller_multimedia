import { RegisterRepository } from "../../repositories/registerRepository";
import { TRegister } from "../types/TRegister";

export class PostRegisterUseCase {
  constructor(private registerRepository: RegisterRepository) {}

  async execute(data: TRegister) {
    return await this.registerRepository.save(data);
  }
}
