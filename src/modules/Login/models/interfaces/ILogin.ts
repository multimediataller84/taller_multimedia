import { TEndpointLogin } from "../types/TEndpointLogin";
import { TLogin } from "../types/TLogin";

export interface ILogin {
  login: (data: TLogin) => Promise<TEndpointLogin>;
}
