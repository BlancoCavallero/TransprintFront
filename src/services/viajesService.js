import {
  getGeneric,
  postGeneric,
  putGeneric,
  deleteGeneric,
} from "./genericService";
import { getHeaders } from "../utils/getHeaders";

export const getViajes = async () => {
  return await getGeneric("/viajes", {}, getHeaders());
};

// Si en el futuro el back soporta a /viajes?page=1&limit=10
// export const getviajess = async (params = {}) => {
//   return await getGeneric("/viajes", params, getHeaders());
// };

// Registrar viajes
export const postViajes = async (data) => {
  return await postGeneric("/viajes", data, getHeaders());
};

// Actualizar viajes
export const putViajes = async (id, data) => {
  return await putGeneric(`/viajes/${id}`, data, getHeaders());
};

// Eliminar viajes
export const deleteViajes = async (id) => {
  return await deleteGeneric(`/viajes/${id}`, getHeaders());
};
