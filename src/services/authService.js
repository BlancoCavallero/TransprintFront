import axios from "axios";
import { backend_url } from "../../configuration/app.config";

export const loginApp = async (username, password) => {
  try {
    const url = `${backend_url}/api/login`;

    const headers = {
      "Content-Type": "application/json",
    };

    const response = await axios.post(url, { username, password }, { headers });

    // Auth0 devuelve access_token
    const token = response.data.access_token;

    if (token) {
      localStorage.setItem("jwtToken", token);
    }

    return response.data;
  } catch (error) {
    console.error("Error en el login:", error.response?.data || error);
    throw error;
  }
};

export const logoutApp = async () => {
  try {

    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("⚠️ Error: No hay token en localStorage");
      return;
    }

    localStorage.removeItem("access_token"); 
  } catch (error) {
    console.error("🚨 Error en el logout:", error.response?.data || error);
  }
};

