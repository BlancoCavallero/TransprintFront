import {
  getGeneric,
  postGeneric,
  putGeneric,
  deleteGeneric,
} from "./genericService";

export const getUsuario = async () => {
  return await getGeneric("/usuarios");
};

// Si en el futuro el back soporta a /usuario?page=1&limit=10
// export const getusuarios = async (params = {}) => {
//   return await getGeneric("/usuario", params);
// };

// Registrar usuario
export const postUsuario = async (data) => {
  return await postGeneric("/register", data);
};

// Actualizar usuario
export const putUsuario = async (id, data) => {
  // Encode the ID to handle special characters like | (pipe)
  const encodedId = encodeURIComponent(id);
  return await putGeneric(`/usuarios/${encodedId}`, data);
};

// Eliminar usuario
export const deleteUsuario = async (id) => {
  // Encode the ID to handle special characters like | (pipe)
  const encodedId = encodeURIComponent(id);
  return await deleteGeneric(`/usuarios/${encodedId}`);
};
