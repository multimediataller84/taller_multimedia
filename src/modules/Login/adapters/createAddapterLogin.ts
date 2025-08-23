import { TEndpointLogin } from "../models/types/TEndpointLogin";
import { TUser } from "../../../models/types/TUser";

export const createAddapterLogin = (user: TEndpointLogin): TUser => {
  return {
    id: user.id,
    username: user.username,
    token: user.token,
  };
};
