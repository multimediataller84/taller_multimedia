import { ILogin } from "../models/interfaces/ILogin";
import { TEndpointLogin } from "../models/types/TEndpointLogin";
import { TLogin } from "../models/types/TLogin";
import axios from "axios";

export class LoginService implements ILogin {
  private static instance: LoginService;
  private readonly baseUrl = import.meta.env.VITE_API_URL;

  static getInstance(): LoginService {
    if (!LoginService.instance) {
      LoginService.instance = new LoginService();
    }
    return LoginService.instance;
  }

  async login(data: TLogin): Promise<TEndpointLogin> {
    try {
          console.log(this.baseUrl + "/login")
      const response = await axios.post<TEndpointLogin>(this.baseUrl + "/login", data);

      if (response.status !== 200) {
        throw new Error(
          `Invalid credentials or server error at ${this.baseUrl + "/login"}`
        );
      }

      return response.data;
    } catch (error) {
      throw new Error(`Invalid credentials or server error login`);
    }
  }
}
