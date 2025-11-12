import { jwtDecode } from "jwt-decode";

export interface JWTPayload {
  sub?: string;
  username?: string;
  role?: string;
  exp?: number;
  name?: string;
  [key: string]: unknown;
}

export const getNameAuth = (): string | null => {
  const auth = sessionStorage.getItem("authToken");
  if (!auth) return null;
    
  try {
    const payload: JWTPayload = jwtDecode(auth);
    if (!payload.name) return null;
    return payload.name;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};

