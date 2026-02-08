import axios from "axios";
import { backend_url } from "../configuration/app.config";

const api = axios.create({
  baseURL: `${backend_url}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// GET (listado o con filtros)
export const getGeneric = async (endpoint, params = {}, headers = {}) => {
  if (!endpoint) throw new Error("Endpoint no definido");
  const response = await api.get(endpoint, { params, headers });
  return response.data;
};

// GET por ID
export const getByIdGeneric = async (
  endpoint,
  id,
  headers = {},
  params = {}
) => {
  if (!endpoint || !id) throw new Error("Endpoint o ID no definido");
  const response = await api.get(`${endpoint}/${id}`, { headers, params });
  return response.data;
};

// POST
export const postGeneric = async (
  endpoint,
  data,
  headers = {},
  params = {}
) => {
  if (!endpoint) throw new Error("Endpoint no definido");
  
  // Si data es FormData, crear una config SIN usar la instancia api predefinida
  // para evitar el Content-Type: application/json predefinido
  if (data instanceof FormData) {
    const response = await axios.post(`${backend_url}/api${endpoint}`, data, {
      headers: {
        ...headers,
        // NO establecer Content-Type, axios lo hará automáticamente con el boundary
      },
      params,
    });
    return response.data;
  }
  
  const response = await api.post(endpoint, data, { headers, params });
  return response.data;
};

// PUT
export const putGeneric = async (endpoint, data, headers = {}, params = {}) => {
  if (!endpoint) throw new Error("Endpoint no definido");
  
  // Si data es FormData, crear una config SIN usar la instancia api predefinida
  if (data instanceof FormData) {
    const response = await axios.put(`${backend_url}/api${endpoint}`, data, {
      headers: {
        ...headers,
        // NO establecer Content-Type, axios lo hará automáticamente con el boundary
      },
      params,
    });
    return response.data;
  }
  
  const response = await api.put(endpoint, data, { headers, params });
  return response.data;
};

// DELETE
export const deleteGeneric = async (endpoint, headers = {}, params = {}) => {
  if (!endpoint) throw new Error("Endpoint no definido");
  const response = await api.delete(endpoint, { headers, params });
  return response.data;
};
