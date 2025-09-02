import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";


const PrivateRoute = () => {
  const { isAuthenticated } = useContext(UsuarioContext);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;