import { TLogin } from "../types/TLogin";
import { TPayload } from "../types/TPayload";

export interface ILogin {
  login: (data: TLogin) => Promise<TPayload>;
}
