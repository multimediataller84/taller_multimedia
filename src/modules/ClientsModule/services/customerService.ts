import { ICustomerService } from "../models/interfaces/ICostumerService";
import { TCustomerEndpoint } from "../models/types/TCustomerEndpoint";
import { TCustomer } from "../models/types/TCustomer";
import apiClient from "../../Login/interceptors/apiClient";
import { TProvince } from "../models/types/TProvince";
import { TCanton } from "../models/types/TCanton";
import { TDistrict } from "../models/types/TDistrict";


export class CustomerService implements ICustomerService {
  private static instance: CustomerService;

  static getInstance(): CustomerService {
    if (!CustomerService.instance) {
      CustomerService.instance = new CustomerService();
    }
    return CustomerService.instance;
  }

  async post(data: TCustomer): Promise<TCustomerEndpoint> {
    try {
      const response = await apiClient.post<TCustomerEndpoint>("/customer", data);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Server error at /customer`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Invalid Customer`);
    }
  }

  async delete(id: number): Promise<TCustomerEndpoint> {
    try {
      const response = await apiClient.delete<TCustomerEndpoint>(`/customer/${id}`);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Server error at delete customer`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Invalid Delete Customer`);
    }
  }

   async get(id: number): Promise<TCustomerEndpoint> {
    try {
      const response = await apiClient.get<TCustomerEndpoint>(`/customer/${id}`);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Server error at get customer`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Invalid get Customer`);
    }
  }

  async patch(id: number, data: TCustomer): Promise<TCustomerEndpoint> {
    try {
      const response = await apiClient.patch<TCustomerEndpoint>(`/customer/${id}`, data);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Server error at get customer`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Invalid get Customer`);
    }
  }

  async getAll(): Promise<TCustomerEndpoint[]> {
    try {
      const response = await apiClient.get<TCustomerEndpoint[]>("/customer/all");

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Server error at get all customer`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Invalid get all customer`);
    }
  }

  async getAllProvinces(): Promise<TProvince[]> {
    try {
      const response = await apiClient.get<any[]>("/customer/province/all");

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Server error at get all province`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Invalid get all province`);
    }
  }

   async getAllCantons(): Promise<TCanton[]> {
    try {
      const response = await apiClient.get<any[]>("/customer/canton/all");

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Server error at get all canton`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Invalid get all canton`);
    }
  }

  async getAllDistricts(): Promise<TDistrict[]> {
    try {
      const response = await apiClient.get<any[]>("/customer/district/all");

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Server error at get all district`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Invalid get all district`);
    }
  }



}
