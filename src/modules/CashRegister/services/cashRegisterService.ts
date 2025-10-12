import apiClient from "../../Login/interceptors/apiClient";
import { ICashRegisterService, TCashRegisterWithUser, TCloseRegister, TOpenRegister } from "../models/interfaces/ICashRegisterService";
import { TCashRegister } from "../models/types/TCashRegister";
import { TCashRegisterEndpoint } from "../models/types/TCashRegisterEndpoint";

export class CashRegisterService implements ICashRegisterService {
    private static instance: CashRegisterService;

    static getInstance(): CashRegisterService {
    if (!CashRegisterService.instance) {
      CashRegisterService.instance = new CashRegisterService();
    }
    return CashRegisterService.instance;
  }

  async getOpenAll(): Promise<TCashRegisterWithUser[]>{
     try{
        const response = await apiClient.get<TCashRegisterWithUser[]>("/cash/register/open/all");

        if(response.status !== 200 && response.status !== 201){
            throw new Error(`Server error at /cash/register/open/all`);
        }

        return response.data;
    } catch (error){
        throw new Error(`Invalid getOpenAll`);
    }
  }

  async getAll(): Promise<TCashRegisterWithUser[]>{
     try{
        const response = await apiClient.get<TCashRegisterWithUser[]>("/cash/register/all");

        if(response.status !== 200 && response.status !== 201){
            throw new Error(`Server error at /cash/register/all`);
        }

        return response.data;
    } catch (error){
        throw new Error(`Invalid getAll`);
    }
  }

  async get(id: number): Promise<TCashRegisterWithUser> {
    try {
      const response = await apiClient.get<TCashRegisterWithUser>(`/cash/register/${id}`);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Server error at /cash/register/id`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Invalid get`);
    }
  }

  async post(data: TCashRegister): Promise<TCashRegisterWithUser> {
    try{
        const response = await apiClient.post<TCashRegisterWithUser>("/cash/register", data);

        if(response.status !== 200 && response.status !== 201){
            throw new Error(`Server error at /cash/register`);
        }

        return response.data;
    } catch (error){
        throw new Error(`Invalid post`);
    }
  }

  async delete(id: number): Promise<TCashRegisterWithUser>{
     try {
      const response = await apiClient.delete<TCashRegisterWithUser>(`/cash/register/${id}`);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Server error at delete /cash/register/${id}`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Invalid delete`);
    }
  }

   async patch(id: number, data: TCashRegister): Promise<TCashRegisterWithUser> {
    try {
      const response = await apiClient.patch<TCashRegisterWithUser>(`/cash/register/${id}`, data);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Server error at /cash/register/id, data`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Invalid patch`);
    }
  }

  async open(id: number, data: TOpenRegister): Promise<TCashRegisterEndpoint> {
    try {
      const response = await apiClient.patch<TCashRegisterWithUser>(`/cash/register/open/${id}`, data);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Server error at /cash/register/open/id, data`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Invalid open`);
    }
  }

  async close(id: number, data: TCloseRegister): Promise<TCashRegisterEndpoint> {
    try {
      const response = await apiClient.patch<TCashRegisterWithUser>(`/cash/register/close/${id}`, data);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Server error at /cash/register/close/id, data`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Invalid close`);
    }
  }

}