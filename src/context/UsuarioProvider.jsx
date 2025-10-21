import { UsuarioContext } from "./UsuarioContext";
import { jwtDecode } from "jwt-decode";
import { useReducer } from "react";
import { types } from "../utils/types";

// Un ejemplo de Provider para version totalmente inicial sin tokens.
const init = () => {
  const idToken = localStorage.getItem("id_token");
  const accessToken = localStorage.getItem("access_token");

  if (idToken && typeof idToken === "string") {
    try {
      const decoded = jwtDecode(idToken);
      if (decoded.exp < Date.now() / 1000) {
        throw new Error("Token expirado");
      }

      return {
        isAuthenticated: true,
        user: decoded, // contiene name, email, picture, etc.
        token: accessToken,
      };
    } catch (error) {
      console.error("Token inválido o expirado:", error);
      localStorage.removeItem("id_token");
      localStorage.removeItem("access_token");
      return { isAuthenticated: false, user: null, token: null };
    }
  }

  return { isAuthenticated: false, user: null, token: null };
};

const reducer = (state, action) => {
  switch (action.type) {
    case types.login:
      return {
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case types.logout:
      return { isAuthenticated: false, user: null, token: null };
    default:
      return state;
  }
};

export const UsuarioProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {}, init);

  const appLogin = (data) => {
    try {
      const { access_token, id_token } = data;

      if (!access_token || !id_token) {
        console.error("⚠️ Faltan tokens en la respuesta del backend");
        return;
      }

      // Decodificamos el id_token para extraer info del usuario
      const decoded = jwtDecode(id_token);

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("id_token", id_token);
      localStorage.setItem("isAuthenticated", true);

      dispatch({
        type: types.login,
        payload: {
          user: decoded,
          token: access_token,
        },
      });
    } catch (error) {
      console.error("Error al procesar el login:", error);
    }
  };

  const appLogout = () => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("id_token");
      localStorage.removeItem("isAuthenticated");
      dispatch({ type: types.logout });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <UsuarioContext.Provider value={{ ...state, appLogin, appLogout }}>
      {children}
    </UsuarioContext.Provider>
  );
};
