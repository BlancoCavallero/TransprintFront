import { useContext } from "react";
import { UsuarioContext } from "../context/UsuarioContext";

export const useAuth = () => {
  const { isAuthenticated, user, appLogin, appLogout, updateUserData, userDataReady } =
    useContext(UsuarioContext);
  return { isAuthenticated, user, appLogin, appLogout, updateUserData, userDataReady };
};
