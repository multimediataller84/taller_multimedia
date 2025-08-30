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

      // Almacena el token en el almacenamiento local
      const token = (response.data as any).token;
    if (token) {
      sessionStorage.setItem("authToken", token);

      // Configura axios para enviar el token
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    }

      return response.data;
    } catch (error) {
      throw new Error(`Invalid credentials or server error login`);
    }
  }
}
