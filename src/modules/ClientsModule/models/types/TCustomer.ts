import type { TCredit } from "./TCredit";

export type TCustomer = {
  name: string,
  last_name: string,
  address: string,
  id_number: string,
  email: string,
  phone: number
  credit?: TCredit;
}