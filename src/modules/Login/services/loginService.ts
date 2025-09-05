// src/modules/Login/services/loginService.ts
import { ILogin } from "../models/interfaces/ILogin";
import { TEndpointLogin } from "../models/types/TEndpointLogin";
import { TLogin } from "../models/types/TLogin";
import { TPayload } from "../models/types/TPayload";
import apiClient from "../interceptors/apiClient";

export class LoginService implements ILogin {
  private static instance: LoginService;

  static getInstance(): LoginService {
    if (!LoginService.instance) {
      LoginService.instance = new LoginService();
    }
    return LoginService.instance;
  }

  async login(data: TLogin): Promise<TPayload> {
    try {
      const response = await apiClient.post<TPayload>("/auth/login", data);

      if (response.status !== 200) {
        throw new Error(`Invalid credentials or server error at /login`);
      }

      const payload = response.data as TPayload;

      sessionStorage.setItem("authToken", payload.token);
      sessionStorage.setItem("username", payload.user.username);
      sessionStorage.setItem("role", payload.user.role);

      return payload;
    } catch (_error) {
      throw new Error("Invalid credentials or server error login");
    }
  }
}
