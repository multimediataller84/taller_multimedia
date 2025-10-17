export type TCustomerEndpoint = {
  id: number 
  name: string,
  last_name: string,
  address: string,
  identification_type: string, 
  id_number: string,
  email: string,
  phone: number,
  credit_enabled: boolean,
  credit_unlimited: boolean,
  credit_limit: number | null,
  createdAt: Date,
  updatedAt: Date,
  province_id: number,
  canton_id: number,
  district_id: number,
  invoices: {
        id: number,
        issue_date: Date,
        due_date: Date,
        subtotal: number,
        tax_total: number,
        total: number,
        amount_paid: number,
        payment_method: string,
        status: string,
        invoice_number: string,
        digital_signature: string | null,
        biometric_hash: string | null
      }[];
}