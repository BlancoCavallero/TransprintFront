import {
  getGeneric,
  postGeneric,
  putGeneric,
  deleteGeneric,
} from "./genericService";

export const getDashboard = async () => {
  return await getGeneric("/dashboard");
};

// Si en el futuro el back soporta a /dashboard?page=1&limit=10
// export const getdashboards = async (params = {}) => {
//   return await getGeneric("/dashboard", params);
// };

// Registrar dashboard
export const postDashboard = async (data) => {
  return await postGeneric("/dashboard", data);
};

// Actualizar dashboard
export const putDashboard = async (id, data) => {
  return await putGeneric(`/dashboard/${id}`, data);
};

// Eliminar dashboard
export const deleteDashboard = async (id) => {
  return await deleteGeneric(`/dashboard/${id}`);
};
