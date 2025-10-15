import {
  getGeneric,
  postGeneric,
  putGeneric,
  deleteGeneric,
} from "./genericService";
import { getHeaders } from "../utils/getHeaders";

export const getUsuario = async () => {
  return await getGeneric("/usuario", {}, getHeaders());
};

// Si en el futuro el back soporta a /usuario?page=1&limit=10
// export const getusuarios = async (params = {}) => {
//   return await getGeneric("/usuario", params, getHeaders());
// };

// Registrar usuario
export const postUsuario = async (data) => {
  return await postGeneric("/usuario", data, getHeaders());
};

// Actualizar usuario
export const putUsuario = async (id, data) => {
  return await putGeneric(`/usuario/${id}`, data, getHeaders());
};

// Eliminar usuario
export const deleteUsuario = async (id) => {
  return await deleteGeneric(`/usuario/${id}`, getHeaders());
};
