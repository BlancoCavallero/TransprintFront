import {
  getGeneric,
  postGeneric,
  putGeneric,
  deleteGeneric,
} from "./genericService";
import { getHeaders } from "../utils/getHeaders";

export const getMantenimiento = async () => {
  return await getGeneric("/mantenimiento", {}, getHeaders());
};

// Si en el futuro el back soporta a /mantenimiento?page=1&limit=10
// export const getmantenimientos = async (params = {}) => {
//   return await getGeneric("/mantenimiento", params, getHeaders());
// };

// Registrar mantenimiento
export const postMantenimiento = async (data) => {
  return await postGeneric("/mantenimiento", data, getHeaders());
};

// Actualizar mantenimiento
export const putMantenimiento = async (id, data) => {
  return await putGeneric(`/mantenimiento/${id}`, data, getHeaders());
};

// Eliminar mantenimiento
export const deleteMantenimiento = async (id) => {
  return await deleteGeneric(`/mantenimiento/${id}`, getHeaders());
};
