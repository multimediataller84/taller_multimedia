import { TUser } from "../models/types/TUser";
import { TUserEndpoint } from "../models/types/TUserEndpoint";

type TUserProfile = Omit<TUser, "email" | "password" | "role_id"> & {
  role: {
    id: number;
    name: string;
  };
};

export const createAddapterProfile = (user: TUserEndpoint): TUserProfile => {
  return {
    name: user.name,
    last_name: user.last_name,
    username: user.username,
    role: {
      id: user.role_id,
      name: user.role?.name ?? "employee",
    },
  };
};
