import { TCustomerEndpoint } from "../types/TCustomerEndpoint";
import { TCustomer } from "../types/TCustomer";
import { TProvince } from "../types/TProvince";
import { TCanton } from "../types/TCanton";
import { TDistrict } from "../types/TDistrict";

export interface ICustomerService {
  post: (data: TCustomer) => Promise<TCustomerEndpoint>;
  delete: (id: number ) => Promise<TCustomerEndpoint>;
  get: (id: number) => Promise<TCustomerEndpoint>;
  patch: (id: number, data: TCustomer) => Promise<TCustomerEndpoint>;
  getAll: () => Promise<TCustomerEndpoint[]>;
  getAllProvinces: () => Promise<TProvince[]>; 
  getAllCantons: () => Promise<TCanton[]>; 
  getAllDistricts: () => Promise<TDistrict[]>; 
}
