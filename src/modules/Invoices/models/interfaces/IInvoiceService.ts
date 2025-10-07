import { TInvoice } from "../types/TInvoice";
import { TInvoiceEndpoint } from "../types/TInvoiceEndpoint";

export interface IInvoiceService {
  post: (data: TInvoice) => Promise<TInvoiceEndpoint>;
  getAll: () => Promise<TInvoiceEndpoint[]>;
  get: (id: number) => Promise<TInvoiceEndpoint>;
}
