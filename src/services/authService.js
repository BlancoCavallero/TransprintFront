import axios from "axios";
import { backend_url } from "../../configuration/app.config";

export const loginApp = async (username, password) => {
  try {
    const url = `${backend_url}/api/session/login`;

    // Configurar los headers (sin token)
    const headers = {
      "Content-Type": "application/json",
    };

    // Enviar credenciales al backend
    const response = await axios.post(url, { username, password }, { headers });

    // Almacenar el token en localStorage o sessionStorage
    if (response.data.payload?.token) {
      localStorage.setItem("jwtToken", response.data.payload.token);
    }

    // Devolver los datos de la respuesta
    return response.data;
  } catch (error) {
    console.error("Error en el login:", error.response?.data || error);
    throw error; // Propagar el error para manejarlo en el componente
  }
};

export const logoutApp = async () => {
  try {
    const url = `${backend_url}/api/session/logout`;
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("⚠️ Error: No hay token en localStorage");
      return;
    }
    await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    localStorage.removeItem("access_token"); // Limpia el token después del logout
  } catch (error) {
    console.error("🚨 Error en el logout:", error.response?.data || error);
  }
};

