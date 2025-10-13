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

async post(data: TInvoice): Promise<void> {
  try {
    const response = await apiClient.post<{ name: string; base64File: string }>(
      "/invoice",
      data,
    );

    const byteCharacters = atob(response.data.base64File);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Comprobante_N°${response.data.name}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error("Invalid Invoice payload");
  }
}

  getAll = async (): Promise<TInvoiceEndpoint[]> => {
    try {
      const response = await apiClient.get<TInvoiceEndpoint[]>("/invoice/all");
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Server error at /invoice/all");
      }
      return response.data;
    } catch (error) {
      throw new Error("Invalid Get Invoices");
    }
  };

  async get(id: number): Promise<TInvoiceEndpoint> {
    try {
      const response = await apiClient.get<TInvoiceEndpoint>(`/invoice/${id}`);
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Server error at /invoice/:id");
      }
      return response.data;
    } catch (error) {
      throw new Error("Invalid Get Invoice");
    }
  }
}
