export type TOpenRegisterUser = {
  id: number;
  name?: string;
  username?: string;
  role_id?: number;
  role?: { id: number; name: string };
};

export type TCashRegisterOpen = {
  id: number;
  opened_at?: string | null;
  closed_at?: string | null;
  opening_amount?: string | number | null;
  amount?: string | number | null;
  closing_amount?: string | number | null;
  status: string; // e.g., 'open'
  user_id: number;
  user?: TOpenRegisterUser;
};
