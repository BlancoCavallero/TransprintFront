import { useEffect, useState } from "react";
import { UsuarioContext } from "./UsuarioContext";


// Un ejemplo de Provider para version totalmente inicial sin tokens.

export const UsuarioProvider = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);


  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthorized");
    if (storedAuth === "true") {
      setIsAuthorized(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("isAuthorized", isAuthorized);
  }, [isAuthorized]);

  const login = () => setIsAuthorized(true);
  const logout = () => setIsAuthorized(false);

  return (
    <UsuarioContext.Provider value={{ isAuthorized, login, logout }}>
      {children}
    </UsuarioContext.Provider>
  );
};