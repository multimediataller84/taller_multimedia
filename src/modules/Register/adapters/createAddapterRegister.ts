import { TEndpointRegister } from "../models/types/TEndpointRegister";
import { TRegister } from "../models/types/TRegister";

export const createAddapterRegister = (user: TEndpointRegister): TRegister => {
  return {
    name: user.name,
    last_name: user.last_name,
    username: user.username,
    email: user.email,
    password: user.password,
    password_confirmation: user.password_confirmation
  };
};
