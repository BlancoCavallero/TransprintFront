import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";

const PublicRoute = () => {
  const { isAuthorized } = useContext(UsuarioContext);

  return !isAuthorized ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default PublicRoute;