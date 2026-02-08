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

// Registrar documentación con archivo PDF
export const postDocumentacion = async (formData) => {
  // NO especificar Content-Type manualmente
  // Axios lo detecta automáticamente cuando es FormData y agrega el boundary
  return await postGeneric("/documentations", formData);
};

// Actualizar documentación (puede o no incluir nuevo archivo)
export const putDocumentacion = async (id, formData) => {
  // NO especificar Content-Type manualmente
  // Axios lo detecta automáticamente cuando es FormData y agrega el boundary
  return await putGeneric(`/documentations/${id}`, formData);
};

// Eliminar documentación
export const deleteDocumentacion = async (id) => {
  return await deleteGeneric(`/documentations/${id}`);
};
