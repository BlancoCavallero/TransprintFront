import {
  getGeneric,
  postGeneric,
  putGeneric,
  deleteGeneric,
} from "./genericService";
import { getHeaders } from "../utils/getHeaders";

export const getReporte = async () => {
  return await getGeneric("/reporte", {}, getHeaders());
};

// Si en el futuro el back soporta a /reporte?page=1&limit=10
// export const getreportes = async (params = {}) => {
//   return await getGeneric("/reporte", params, getHeaders());
// };

// Registrar reporte
export const postReporte = async (data) => {
  return await postGeneric("/reporte", data, getHeaders());
};

// Actualizar reporte
export const putReporte = async (id, data) => {
  return await putGeneric(`/reporte/${id}`, data, getHeaders());
};

// Eliminar reporte
export const deleteReporte = async (id) => {
  return await deleteGeneric(`/reporte/${id}`, getHeaders());
};
