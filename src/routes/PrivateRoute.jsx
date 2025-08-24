import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";


const PrivateRoute = () => {
  const { isAuthorized } = useContext(UsuarioContext);

  return isAuthorized ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;