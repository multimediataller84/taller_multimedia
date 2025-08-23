import { TEndpointRegister } from "../types/TEndpointRegister";
import { TRegister } from "../types/TRegister";

export interface IAxiosService {
  save: (data: TRegister) => Promise<TEndpointRegister>;
}
