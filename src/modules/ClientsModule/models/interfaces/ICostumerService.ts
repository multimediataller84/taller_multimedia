import { TCustomerEndpoint } from "../types/TCustomerEndpoint";
import { TCustomer } from "../types/TCustomer";

export interface ICustomerService {
  post: (data: TCustomer) => Promise<TCustomerEndpoint>;
  delete: (id: number ) => Promise<TCustomerEndpoint>;
  get: (id: number) => Promise<TCustomerEndpoint>;
  patch: (id: number, data: TCustomer) => Promise<TCustomerEndpoint>;
  getAll: () => Promise<TCustomerEndpoint[]>;
}
