import apiClient from "../../Login/interceptors/apiClient";
import type { TCashRegisterOpen } from "../models/types/TCashRegisterOpen";

export class CashRegisterService {
  private static instance: CashRegisterService;
  static getInstance(): CashRegisterService {
    if (!CashRegisterService.instance) CashRegisterService.instance = new CashRegisterService();
    return CashRegisterService.instance;
  }

  async getOpenAll(): Promise<TCashRegisterOpen[]> {
    const resp = await apiClient.get<TCashRegisterOpen[]>("/cash/register/open/all");
    if (resp.status !== 200 && resp.status !== 201) {
      throw new Error("Server error at /cash/register/open/all");
    }
    return resp.data;
  }
}
