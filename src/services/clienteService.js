import {
  getGeneric,
  postGeneric,
  putGeneric,
  deleteGeneric,
} from "./genericService";

export const getCliente = async () => {
  return await getGeneric("/cliente");
};

// Si en el futuro el back soporta a /cliente?page=1&limit=10
// export const getClientes = async (params = {}) => {
//   return await getGeneric("/cliente", params);
// };

// Registrar cliente
export const postCliente = async (data) => {
  return await postGeneric("/cliente", data);
};

// Actualizar cliente
export const putCliente = async (id, data) => {
  return await putGeneric(`/cliente/${id}`, data);
};

// Eliminar cliente
export const deleteCliente = async (id) => {
  return await deleteGeneric(`/cliente/${id}`);
};
