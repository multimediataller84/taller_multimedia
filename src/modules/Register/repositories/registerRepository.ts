import { IRegister } from "../models/interfaces/IRegister";
import { TEndpointRegister } from "../models/types/TEndpointRegister";
import { TRegister } from "../models/types/TRegister";
import { RegisterService } from "../services/registerService";

export class RegisterRepository implements IRegister {
  private static instance: RegisterRepository;
  private registerService = RegisterService.getInstance();

  public static getInstance(): RegisterRepository {
    if (!RegisterRepository.instance) {
      RegisterRepository.instance = new RegisterRepository();
    }
    return RegisterRepository.instance;
  }

  async save(data: TRegister): Promise<TEndpointRegister> {
    const response = await this.registerService.save(data);
    if (!response) {
      throw new Error("Error at crate user");
    }
    return response;
  }
}
