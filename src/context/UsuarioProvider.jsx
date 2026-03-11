import { UsuarioContext } from "./UsuarioContext";
import { jwtDecode } from "jwt-decode";
import { useReducer } from "react";
import { types } from "../utils/types";

// Un ejemplo de Provider para version totalmente inicial sin tokens.
const init = () => {
  const idToken = localStorage.getItem("id_token");
  const accessToken = localStorage.getItem("access_token");
  const userDataStored = localStorage.getItem("user_data");

  if (idToken && typeof idToken === "string") {
    try {
      const decoded = jwtDecode(idToken);
      if (decoded.exp < Date.now() / 1000) {
        throw new Error("Token expirado");
      }

      // Si tenemos datos guardados, usarlos; si no, usar decoded
      let userData = userDataStored ? JSON.parse(userDataStored) : decoded;

      return {
        isAuthenticated: true,
        user: userData,
        token: accessToken,
        userDataReady: !!(userData.nombre_completo && userData.roles?.length > 0),
      };
    } catch (error) {
      console.error("Token inválido o expirado:", error);
      localStorage.removeItem("id_token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_data");
      return { isAuthenticated: false, user: null, token: null, userDataReady: false };
    }
  }

  return { isAuthenticated: false, user: null, token: null, userDataReady: false };
};

const reducer = (state, action) => {
  switch (action.type) {
    case types.login:
      return {
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        userDataReady: false,
      };
    case types.logout:
      return { isAuthenticated: false, user: null, token: null, userDataReady: false };
    case types.updateUserData:
      return {
        ...state,
        user: { ...state.user, ...action.payload.user },
        userDataReady: true,
      };
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

      // Decodificamos el id_token para extraer info básica del usuario
      const decoded = jwtDecode(id_token);

      // Guardar solo datos básicos del token (sin datos completos de usuario)
      const baseUserData = {
        user_id: decoded.user_id || decoded.sub,
        username: decoded.username || '',
        email: decoded.email || '',
        nombre_completo: '', // Vacío, será llenado después
        roles: [], // Vacío, será llenado después
      };

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("id_token", id_token);
      localStorage.setItem("isAuthenticated", true);
      
      // Guardar datos básicos pero marcar que no están completos
      localStorage.setItem("user_data", JSON.stringify(baseUserData));



      dispatch({
        type: types.login,
        payload: {
          user: baseUserData,
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
      localStorage.removeItem("user_data");
      dispatch({ type: types.logout });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const updateUserData = (userData) => {
    try {
      // Actualizar localStorage
      const currentUserData = JSON.parse(localStorage.getItem("user_data") || "{}");
      const updatedUserData = { ...currentUserData, ...userData };
      localStorage.setItem("user_data", JSON.stringify(updatedUserData));

      // Actualizar contexto
      dispatch({
        type: types.updateUserData,
        payload: {
          user: updatedUserData,
        },
      });

      console.log("✅ Datos del usuario actualizados:", updatedUserData);
    } catch (error) {
      console.error("Error al actualizar datos del usuario:", error);
    }
  };

  return (
    <UsuarioContext.Provider value={{ ...state, appLogin, appLogout, updateUserData, userDataReady: state.userDataReady }}>
      {children}
    </UsuarioContext.Provider>
  );
};
