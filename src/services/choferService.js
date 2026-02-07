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

// Eliminar chofer (deprecado - usar baja)
export const deleteChofer = async (id) => {
  return await deleteGeneric(`/drivers/${id}`);
};

// Dar de baja chofer
export const bajaChofer = async (id) => {
  return await putGeneric(`/drivers/${id}/baja`, {});
};

// Reactivar chofer
export const reactivarChofer = async (id) => {
  return await putGeneric(`/drivers/${id}/reactivar`, {});
};
