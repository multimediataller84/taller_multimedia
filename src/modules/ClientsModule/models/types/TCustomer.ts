import type { TCredit } from "../../../Credit/models/types/TCredit";

export type TCustomer = {
  name: string,
  last_name: string,
  address: string,
  identification_type: string, 
  id_number: string,
  email: string,
  phone: number,
  province_id: number,
  canton_id: number,
  district_id: number,
  credit?: TCredit;
}