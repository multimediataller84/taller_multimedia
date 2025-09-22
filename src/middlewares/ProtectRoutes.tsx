import { Navigate } from "react-router-dom";
import { getRoleAuth } from "../utils/getRoleAuth";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const role = getRoleAuth();

  if (!role) return <Navigate to="/" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/product" replace />;
  }
  return <>{children}</>;
};