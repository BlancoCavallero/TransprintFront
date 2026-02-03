import {
  getGeneric,
  postGeneric,
  putGeneric,
  deleteGeneric,
} from "./genericService";

export const getMantenimiento = async () => {
  return await getGeneric("/mantenimientos");
};

// Si en el futuro el back soporta a /mantenimientos?page=1&limit=10
// export const getMantenimientos = async (params = {}) => {
//   return await getGeneric("/mantenimientos", params);
// };

// Registrar mantenimiento
export const postMantenimiento = async (data) => {
  return await postGeneric("/mantenimientos", data);
};

// Actualizar mantenimiento
export const putMantenimiento = async (id, data) => {
  return await putGeneric(`/mantenimientos/${id}`, data);
};

// Eliminar mantenimiento
export const deleteMantenimiento = async (id) => {
  return await deleteGeneric(`/mantenimientos/${id}`);
};
