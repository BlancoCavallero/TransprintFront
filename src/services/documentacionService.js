import {
  getGeneric,
  postGeneric,
  putGeneric,
  deleteGeneric,
} from "./genericService";

// Obtener toda la documentación
export const getDocumentacion = async () => {
  return await getGeneric("/documentations");
};

// Registrar documentación
export const postDocumentacion = async (data) => {
  return await postGeneric("/documentations", data);
};

// Actualizar documentación
export const putDocumentacion = async (id, data) => {
  return await putGeneric(`/documentations/${id}`, data);
};

// Eliminar documentación
export const deleteDocumentacion = async (id) => {
  return await deleteGeneric(`/documentations/${id}`);
};
