import { TUser } from "../../../models/types/TUser";
import { TPayload } from "../models/types/TPayload";

export const createAddapterLogin = (user: TPayload): TUser => {
  return {
    id: user.user.id,
    username: user.user.username,
  };
};
