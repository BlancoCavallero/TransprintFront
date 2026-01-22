import {
  getGeneric,
  postGeneric,
  putGeneric,
  deleteGeneric,
} from "./genericService";

export const getVehiculo = async () => {
  return await getGeneric("/vehiculo");
};

// Si en el futuro el back soporta a /vehiculo?page=1&limit=10
// export const getvehiculos = async (params = {}) => {
//   return await getGeneric("/vehiculo", params);
// };

// Registrar vehiculo
export const postVehiculo = async (data) => {
  return await postGeneric("/vehiculo", data);
};

// Actualizar vehiculo
export const putVehiculo = async (id, data) => {
  return await putGeneric(`/vehiculo/${id}`, data);
};

// Eliminar vehiculo
export const deleteVehiculo = async (id) => {
  return await deleteGeneric(`/vehiculo/${id}`);
};
