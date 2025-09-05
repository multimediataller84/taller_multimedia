import { TUser } from "../../../models/types/TUser";
import { TPayload } from "../models/types/TPayload";

export const createAddapterLogin = (payload: TPayload): TUser => {
  return {
    id: payload.user.id,
    username: payload.user.username,
    token: payload.token,
  };
};
