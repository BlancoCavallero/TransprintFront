import {
  getGeneric,
  postGeneric,
  putGeneric,
  deleteGeneric,
} from "./genericService";

// Obtener todos los clientes
export const getCliente = async () => {
  return await getGeneric("/clients");
};

// Obtener localidades para el desplegable
export const getLocalidades = async () => {
  return await getGeneric("/localidades");
};

// Registrar cliente
export const postCliente = async (data) => {
  return await postGeneric("/clients", data);
};

// Actualizar cliente
export const putCliente = async (id, data) => {
  return await putGeneric(`/clients/${id}`, data);
};

// Eliminar cliente (deprecado - usar baja)
export const deleteCliente = async (id) => {
  return await deleteGeneric(`/clients/${id}`);
};

// Dar de baja cliente
export const bajaCliente = async (id) => {
  return await putGeneric(`/clients/${id}/baja`, {});
};

// Reactivar cliente
export const reactivarCliente = async (id) => {
  return await putGeneric(`/clients/${id}/reactivar`, {});
};
