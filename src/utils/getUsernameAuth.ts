import { jwtDecode } from "jwt-decode";

export interface JWTPayload {
  sub?: string;
  username?: string;
  role?: string;
  exp?: number;
  [key: string]: unknown;
}

export const getUsernameAuth = (): string | null => {
  const auth = sessionStorage.getItem("authToken");
  if (!auth) return null;
    
  try {
    const payload: JWTPayload = jwtDecode(auth);
    if (!payload.username) return null;
    return payload.username;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};

