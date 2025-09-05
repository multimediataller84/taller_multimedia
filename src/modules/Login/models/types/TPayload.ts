export type TPayload = {
  username: string;
  user: { id: number; email: string; username: string; role: string };
  token: string;
};
