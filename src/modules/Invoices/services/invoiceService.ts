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
      throw error as unknown as Error;
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

  /**
   * Intenta recuperar el historial de facturas paginadas del servidor.
   */
  getPaged = async (
    params: { page: number; limit: number; search?: string; signal?: AbortSignal }
  ): Promise<{ items: TInvoiceEndpoint[]; total: number }> => {
    const { page, limit, search, signal } = params;
    const query = new URLSearchParams();
    query.set("page", String(page));
    query.set("limit", String(limit));
    if (search) query.set("search", search);
    const url = `/invoice?${query.toString()}`;
    const response = await apiClient.get<{ items?: TInvoiceEndpoint[]; data?: TInvoiceEndpoint[]; total?: number; count?: number }>(url, { signal });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Server error at /invoice paginated");
    }
    const body = response.data as unknown as { items?: TInvoiceEndpoint[]; data?: TInvoiceEndpoint[]; total?: number; count?: number };
    const items = (body.items ?? body.data) as TInvoiceEndpoint[] | undefined;
    const total = (typeof body.total === "number" ? body.total : body.count) as number | undefined;
    if (!Array.isArray(items) || typeof total !== "number") {
      throw new Error("Unexpected pagination response shape");
    }
    return { items, total };
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
