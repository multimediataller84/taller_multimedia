import { ILogin } from "../models/interfaces/ILogin";
import { TLogin } from "../models/types/TLogin";
import { TPayload } from "../models/types/TPayload"; 
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

  async login(data: TLogin): Promise<TPayload> {
    try {
          console.log(this.baseUrl + "/auth/login")
      const response = await axios.post<TPayload>(this.baseUrl + "/auth/login", data);

      if (response.status !== 200) {
        throw new Error(
          `Invalid credentials or server error at ${this.baseUrl + "/auth/login"}`
        );
      }

      // Almacena el token en el almacenamiento local
      sessionStorage.setItem("authToken", response.data.token);
      sessionStorage.setItem("authToken", response.data.user.username);
      sessionStorage.setItem("authToken", response.data.user.role);

      // Configura axios para enviar el token
      const token = (response.data as TPayload).token;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return response.data;
    } catch (error) {
      throw new Error(`Invalid credentials or server error login`);
    }
  }
}
