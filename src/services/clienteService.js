import {
  getGeneric,
  postGeneric,
  putGeneric,
  deleteGeneric,
} from "./genericService";
import { getHeaders } from "../utils/getHeaders";

export const getCliente = async () => {
  return await getGeneric("/cliente", {}, getHeaders());
};

// Si en el futuro el back soporta a /cliente?page=1&limit=10
// export const getClientes = async (params = {}) => {
//   return await getGeneric("/cliente", params, getHeaders());
// };

// Registrar cliente
export const postCliente = async (data) => {
  return await postGeneric("/cliente", data, getHeaders());
};

// Actualizar cliente
export const putCliente = async (id, data) => {
  return await putGeneric(`/cliente/${id}`, data, getHeaders());
};

// Eliminar cliente
export const deleteCliente = async (id) => {
  return await deleteGeneric(`/cliente/${id}`, getHeaders());
};
