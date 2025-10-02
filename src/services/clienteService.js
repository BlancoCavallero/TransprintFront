import {
  getGeneric,
  postGeneric,
  putGeneric,
  deleteGeneric,
} from "./genericService";
import { getHeaders } from "../utils/getHeaders";

export const getCliente = async (pagina, itemsPorPagina, empresaId) => {
  return await getGeneric(
    "/cliente",
    pagina,
    itemsPorPagina,
    empresaId,
    getHeaders()
  );
};

export const postCliente = async (data) => {
  return await postGeneric("/cliente", data, getHeaders());
};

export const putCliente = async (id, data) => {
  return await putGeneric(`/cliente/${id}`, data, getHeaders());
};

export const deleteCliente = async (id) => {
  return await await deleteGeneric(`/cliente/${id}`, getHeaders());
};
