import axios from "axios";
import { backend_url } from "../configuration/app.config";

const api = axios.create({
  baseURL: backend_url,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getViajes = async () => {
  const response = await api.get("/viajes");
  return response.data;
};

// Registrar viajes
export const postViajes = async (data) => {
  const response = await api.post("/viajes", data);
  return response.data;
};

// Actualizar viajes
export const putViajes = async (id, data) => {
  const response = await api.put(`/viajes/${id}`, data);
  return response.data;
};

// Eliminar viajes
export const deleteViajes = async (id) => {
  const response = await api.delete(`/viajes/${id}`);
  return response.data;
};
