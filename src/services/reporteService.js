import {
  getGeneric,
  postGeneric,
  putGeneric,
  deleteGeneric,
} from "./genericService";

export const getReporte = async () => {
  return await getGeneric("/reporte");
};

// Si en el futuro el back soporta a /reporte?page=1&limit=10
// export const getreportes = async (params = {}) => {
//   return await getGeneric("/reporte", params);
// };

// Registrar reporte
export const postReporte = async (data) => {
  return await postGeneric("/reporte", data);
};

// Actualizar reporte
export const putReporte = async (id, data) => {
  return await putGeneric(`/reporte/${id}`, data);
};

// Eliminar reporte
export const deleteReporte = async (id) => {
  return await deleteGeneric(`/reporte/${id}`);
};
