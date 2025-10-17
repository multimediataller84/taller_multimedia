import { Routes, Route } from "react-router-dom";
import Login from "../modules/Login/screen/Login";
import Register from "../modules/Register/screen/Register";
import { Home } from "../modules/Home/screen/Home";
import Product from "../modules/Product/screen/Product";
import { Client } from "../modules/ClientsModule/screen/Client";
import {Profile} from "../modules/Profile/screen/Profile"
import { ProtectedRoute } from "../middlewares/ProtectRoutes";
import { Dashboard } from "../modules/Dashboard/screen/Dashboard";
import { Taxes } from "../modules/Taxes/screen/Taxes";
import { Invoices } from "../modules/Invoices/screen/Invoices";
import { CashRegister } from "../modules/CashRegister/screen/cashRegister";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute allowedRoles={["employee", "admin"]}>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Product />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients"
        element={
          <ProtectedRoute allowedRoles={["employee", "admin"]}>
            <Client />
          </ProtectedRoute>
        }
      />
      <Route
        path="/taxes"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Taxes />
          </ProtectedRoute>
        }
      />
       <Route
        path="/invoices"
        element={
          <ProtectedRoute allowedRoles={["employee", "admin"]}>
            <Invoices />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profiles"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cashRegister"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CashRegister />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
