import { Routes, Route } from "react-router-dom";
import Login from "../modules/Login/screen/Login";
import Register from "../modules/Register/screen/Register";
import { Home } from "../modules/Home/screen/Home";
import { Product } from "../modules/Product/screen/Product";
import { Invoice } from "../modules/Facturas/Facturas";

export const Router = () => {
  return (
    <Routes>
      <Route Component={Login} path="/" />
      <Route Component={Register} path="/register" />
      <Route Component={Home} path="/home" />
      <Route Component={Home} path="/dashboard" />
      <Route Component={Product} path="/products" />
      <Route Component={Invoice} path="/facturas" />
    </Routes>
  );
};
