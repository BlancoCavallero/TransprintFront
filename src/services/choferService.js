import {
  getGeneric,
  postGeneric,
  putGeneric,
  deleteGeneric,
} from "./genericService";
import { getHeaders } from "../utils/getHeaders";

export const getChofer = async () => {
  return await getGeneric("/chofer", {}, getHeaders());
};

// Si en el futuro el back soporta a /cliente?page=1&limit=10
// export const getChofer = async (params = {}) => {
//   return await getGeneric("/cliente", params, getHeaders());
// };

// Registrar cliente
export const postChofer = async (data) => {
  return await postGeneric("/chofer", data, getHeaders());
};

// Actualizar chofer
export const putChofer = async (id, data) => {
  return await putGeneric(`/chofer/${id}`, data, getHeaders());
};

// Eliminar chofer
export const deleteChofer = async (id) => {
  return await deleteGeneric(`/chofer/${id}`, getHeaders());
};
