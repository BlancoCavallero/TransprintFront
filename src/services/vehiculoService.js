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

// Eliminar vehiculo
export const deleteVehiculo = async (id) => {
  return await deleteGeneric(`/vehiculos/${id}`);
};
