import {
  getGeneric,
  postGeneric,
  putGeneric,
  deleteGeneric,
} from "./genericService";

// Obtener todos los choferes
export const getChofer = async (params = {}) => {
  return await getGeneric("/drivers", params);
};

// Registrar chofer
export const postChofer = async (data) => {
  return await postGeneric("/drivers", data);
};

// Actualizar chofer
export const putChofer = async (id, data) => {
  return await putGeneric(`/drivers/${id}`, data);
};

// Eliminar chofer
export const deleteChofer = async (id) => {
  return await deleteGeneric(`/drivers/${id}`);
};
