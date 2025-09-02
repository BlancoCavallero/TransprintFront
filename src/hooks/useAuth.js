import { useContext } from "react";
import { UsuarioContext } from "../context/UsuarioContext";

export const useAuth = () => {
  const { isAuthenticated, appLogin, appLogout } = useContext(UsuarioContext);
  return { isAuthenticated, appLogin, appLogout };
};
