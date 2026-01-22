import {
  getGeneric,
  postGeneric,
  putGeneric,
  deleteGeneric,
} from "./genericService";

export const getChofer = async () => {
  return await getGeneric("/chofer");
};

// Si en el futuro el back soporta a /cliente?page=1&limit=10
// export const getChofer = async (params = {}) => {
//   return await getGeneric("/cliente", params);
// };

// Registrar cliente
export const postChofer = async (data) => {
  return await postGeneric("/chofer", data);
};

// Actualizar chofer
export const putChofer = async (id, data) => {
  return await putGeneric(`/chofer/${id}`, data);
};

// Eliminar chofer
export const deleteChofer = async (id) => {
  return await deleteGeneric(`/chofer/${id}`);
};
