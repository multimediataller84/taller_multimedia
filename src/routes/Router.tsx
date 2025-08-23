import { Routes, Route } from "react-router-dom";
import Login from "../modules/Login/screen/Login";
import Register from "../modules/Register/screen/Register";
import { Home } from "../modules/Home/screen/Home";

export const Router = () => {
  return (
    <Routes>
      <Route Component={Login} path="/" />
      <Route Component={Register} path="/register" />
      <Route Component={Home} path="/home" />
    </Routes>
  );
};
