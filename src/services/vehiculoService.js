import {
  getGeneric,
  postGeneric,
  putGeneric,
  deleteGeneric,
} from "./genericService";

export const getVehiculo = async (params = {}) => {
  return await getGeneric("/vehiculos", params);
};

// Registrar vehiculo
export const postVehiculo = async (data) => {
  return await postGeneric("/vehiculos", data);
};

// Actualizar vehiculo
export const putVehiculo = async (id, data) => {
  return await putGeneric(`/vehiculos/${id}`, data);
};

// Eliminar vehiculo (deprecado - usar baja)
export const deleteVehiculo = async (id) => {
  return await deleteGeneric(`/vehiculos/${id}`);
};

// Dar de baja vehiculo
export const bajaVehiculo = async (id) => {
  return await putGeneric(`/vehiculos/${id}/baja`, {});
};

// Reactivar vehiculo
export const reactivarVehiculo = async (id) => {
  return await putGeneric(`/vehiculos/${id}/reactivar`, {});
};
