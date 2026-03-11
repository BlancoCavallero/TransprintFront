import {
  getGeneric,
  postGeneric,
  putGeneric,
  deleteGeneric,
} from "./genericService";

export const getExpenses = async () => {
  return await getGeneric("/expenses");
};

// Si en el futuro el back soporta a /dashboard?page=1&limit=10
// export const getdashboards = async (params = {}) => {
//   return await getGeneric("/dashboard", params);
// };

// Registrar dashboard
export const postExpenses = async (data) => {
  return await postGeneric("/expenses", data);
};

// Actualizar dashboard
export const putExpenses = async (id, data) => {
  return await putGeneric(`/expenses/${id}`, data);
};

// Eliminar dashboard
export const deleteExpenses = async (id) => {
  return await deleteGeneric(`/expenses/${id}`);
};
