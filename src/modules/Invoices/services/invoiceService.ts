import apiClient from "../../Login/interceptors/apiClient";
import type { IInvoiceService } from "../models/interfaces/IInvoiceService";
import type { TInvoice } from "../models/types/TInvoice";
import type { TInvoiceEndpoint } from "../models/types/TInvoiceEndpoint";

export class InvoiceService implements IInvoiceService {
  private static instance: InvoiceService;

  static getInstance(): InvoiceService {
    if (!InvoiceService.instance) {
      InvoiceService.instance = new InvoiceService();
    }
    return InvoiceService.instance;
  }

  async post(data: TInvoice): Promise<TInvoiceEndpoint> {
    try {
      const response = await apiClient.post<TInvoiceEndpoint>("/invoice", data);
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Server error at /invoice");
      }
      return response.data;
    } catch (error) {
      throw new Error("Invalid Invoice payload");
    }
  }

  async getAll(): Promise<TInvoiceEndpoint[]> {
    try {
      const response = await apiClient.get<TInvoiceEndpoint[]>("/invoice/all");
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Server error at /invoice/all");
      }
      return response.data;
    } catch (error) {
      throw new Error("Invalid Get Invoices");
    }
  }
}
