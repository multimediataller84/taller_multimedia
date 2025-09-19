import { TUser } from "../types/TUser";
import { TUserEndpoint } from "../types/TUserEndpoint";

export interface IProfileServices {
  get: (id: number) => Promise<TUserEndpoint>;
  getAll: (/*options: TGetAllOptions  Para paginar*/) => Promise<TUserEndpoint[]>;
  post: (data: TUser) => Promise<TUserEndpoint>;
  patch: (id: number, data: TUser) => Promise<TUserEndpoint>;
  delete: (id: number) => Promise<TUserEndpoint>;
}
