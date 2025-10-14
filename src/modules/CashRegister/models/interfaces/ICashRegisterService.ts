import { TCashRegister } from "../types/TCashRegister"
import { TCashRegisterEndpoint } from "../types/TCashRegisterEndpoint";
import { TUserProfile } from "../types/TUserProfile";

export type TCashRegisterWithUser = TCashRegisterEndpoint & { user: TUserProfile }

export type TOpenRegister = {
  user_id: number;
  opening_amount: number;
};

export type TCloseRegister = {
  closing_amount: number;
};

export interface ICashRegisterService {
    getOpenAll: () => Promise<TCashRegisterWithUser[]>;
    getAll: () => Promise<TCashRegisterWithUser[]>;
    get: (id: number) => Promise<TCashRegisterWithUser>;
    post: (data: TCashRegister) => Promise<TCashRegisterWithUser>;
    delete: (id: number) => Promise<TCashRegisterWithUser>;
    patch: (id: number, data: TCashRegister) => Promise<TCashRegisterWithUser>;
    open: (id: number, data: TOpenRegister) => Promise<TCashRegisterEndpoint>;
    close: (id: number, data: TCloseRegister) => Promise<TCashRegisterEndpoint>;
}

/*
cashRegisterRouter.get("/open/all", cashRegisterController.getOpen);
cashRegisterRouter.get("/all", cashRegisterController.getAll);
cashRegisterRouter.get("/:id", cashRegisterController.get);
cashRegisterRouter.post("/", cashRegisterController.post);
cashRegisterRouter.patch("/:id", cashRegisterController.patch);
cashRegisterRouter.delete("/:id", cashRegisterController.delete);
cashRegisterRouter.patch("/open/:id", cashRegisterController.open);
cashRegisterRouter.patch("/close/:id", cashRegisterController.close);
*/