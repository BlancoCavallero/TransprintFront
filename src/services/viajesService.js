import {
  getGeneric,
  postGeneric,
  putGeneric,
  deleteGeneric,
} from "./genericService";

export const getViajes = async () => {
  return await getGeneric("/viajes");
};

// Si en el futuro el back soporta a /viajes?page=1&limit=10
// export const getviajess = async (params = {}) => {
//   return await getGeneric("/viajes", params);
// };

// Registrar viajes
export const postViajes = async (data) => {
  return await postGeneric("/viajes", data);
};

// Actualizar viajes
export const putViajes = async (id, data) => {
  return await putGeneric(`/viajes/${id}`, data);
};

// Eliminar viajes
export const deleteViajes = async (id) => {
  return await deleteGeneric(`/viajes/${id}`);
};
