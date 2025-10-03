import { ICustomerService } from "../models/interfaces/ICostumerService";
import { TCustomerEndpoint } from "../models/types/TCustomerEndpoint";
import { TCustomer } from "../models/types/TCustomer";
import apiClient from "../../Login/interceptors/apiClient";

type CreditSummary = {
  enabled: boolean;
  unlimited: boolean;
  limit: number | null;
  used: number;
  available: number | "infinite";
};

export class CustomerService implements ICustomerService {
  private static instance: CustomerService;

  static getInstance(): CustomerService {
    if (!CustomerService.instance) {
      CustomerService.instance = new CustomerService();
    }
    return CustomerService.instance;
  }

  private toDto(data: TCustomer) {
    const anyData = data as any;
    const hasNested = anyData.credit != null;

    const enabled = hasNested ? !!anyData.credit.enabled : !!anyData.credit_enabled;
    const unlimited = hasNested ? !!anyData.credit.unlimited : !!anyData.credit_unlimited;
    const limit = unlimited
      ? null
      : (hasNested
          ? (anyData.credit.limit ?? 0)
          : (anyData.credit_limit ?? 0));

    return {
      id_number: anyData.id_number ?? null,
      phone: anyData.phone ?? null,
      name: anyData.name,
      last_name: anyData.last_name ?? null,
      email: anyData.email ?? null,
      address: anyData.address ?? null,
      credit_enabled: enabled,
      credit_unlimited: unlimited,
      credit_limit: limit,
    };
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

}
