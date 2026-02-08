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
  // FormData requiere headers multipart/form-data
  // Axios lo establece automáticamente cuando detecta FormData
  const headers = {
    'Content-Type': 'multipart/form-data',
  };
  return await postGeneric("/documentations", formData, headers);
};

// Actualizar documentación (puede o no incluir nuevo archivo)
export const putDocumentacion = async (id, formData) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
  };
  return await putGeneric(`/documentations/${id}`, formData, headers);
};

// Eliminar documentación
export const deleteDocumentacion = async (id) => {
  return await deleteGeneric(`/documentations/${id}`);
};
