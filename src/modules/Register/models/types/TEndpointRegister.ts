export type TEndpointRegister = {
  name: string;
  last_name: string;
  username: string;
  email: string;
  online: boolean;
  last_seen: Date | never;
  email_verified_at: string; 
  created_at: Date | string;
  updated_at: Date | string;
  password: string;
  token: string;
  password_confirmation: string
};
