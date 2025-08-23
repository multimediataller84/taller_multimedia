import { IRegister } from "../models/interfaces/IRegister";
import { TEndpointRegister } from "../models/types/TEndpointRegister";
import { TRegister } from "../models/types/TRegister";
import axios from "axios";

export class RegisterService implements IRegister {
  private static instance: RegisterService;
  private readonly baseUrl = import.meta.env.VITE_API_URL;

  static getInstance(): RegisterService {
    if (!RegisterService.instance) {
      RegisterService.instance = new RegisterService();
    }
    return RegisterService.instance;
  }

  async save(data: TRegister): Promise<TEndpointRegister> {
   try {
    console.log(this.baseUrl + "/register", data)
      const response = await axios.post<TEndpointRegister>(this.baseUrl + "/register", data);

      if (response.status !== 201) {
        throw new Error(
          `Invalid credentials or server error at ${this.baseUrl + "/register"}`
        );
      }

      return response.data;
    } catch (error) {
      throw new Error(`Invalid credentials or server error register${error}`);
    }
  }
}
