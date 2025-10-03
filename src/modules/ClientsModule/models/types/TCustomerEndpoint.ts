export type TCustomerEndpoint = {
  id: number 
  name: string,
  last_name: string,
  address: string,
  id_number: string,
  email: string,
  phone: number,
  credit_enabled: boolean,
  credit_unlimited: boolean,
  credit_limit: number | null,
  createdAt: Date,
  updatedAt: Date
}