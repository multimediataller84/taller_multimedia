// src/modules/Register/services/registerService.ts
import { IRegister } from "../models/interfaces/IRegister";
import { TEndpointRegister } from "../models/types/TEndpointRegister";
import { TRegister } from "../models/types/TRegister";
import apiClient from "../../Login/interceptors/apiClient";

export class RegisterService implements IRegister {
  private static instance: RegisterService;

  static getInstance(): RegisterService {
    if (!RegisterService.instance) {
      RegisterService.instance = new RegisterService();
    }
    return RegisterService.instance;
  }

  async save(data: TRegister): Promise<TEndpointRegister> {
    try {
      const response = await apiClient.post<TEndpointRegister>("/auth/register", data);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Server error at /auth/register`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Invalid credentials or server error register`);
    }
  }
}
