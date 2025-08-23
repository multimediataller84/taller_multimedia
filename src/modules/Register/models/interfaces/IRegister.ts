import { TEndpointRegister } from "../types/TEndpointRegister";
import { TRegister } from "../types/TRegister";

export interface IRegister {
  save: (data: TRegister) => Promise<TEndpointRegister>;
}
