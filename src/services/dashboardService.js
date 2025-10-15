import {
  getGeneric,
  postGeneric,
  putGeneric,
  deleteGeneric,
} from "./genericService";
import { getHeaders } from "../utils/getHeaders";

export const getDashboard = async () => {
  return await getGeneric("/dashboard", {}, getHeaders());
};

// Si en el futuro el back soporta a /dashboard?page=1&limit=10
// export const getdashboards = async (params = {}) => {
//   return await getGeneric("/dashboard", params, getHeaders());
// };

// Registrar dashboard
export const postDashboard = async (data) => {
  return await postGeneric("/dashboard", data, getHeaders());
};

// Actualizar dashboard
export const putDashboard = async (id, data) => {
  return await putGeneric(`/dashboard/${id}`, data, getHeaders());
};

// Eliminar dashboard
export const deleteDashboard = async (id) => {
  return await deleteGeneric(`/dashboard/${id}`, getHeaders());
};
