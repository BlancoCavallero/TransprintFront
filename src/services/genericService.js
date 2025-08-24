import { backend_url } from '../configuration/app.config';
import axios from 'axios';

import axios from "axios";
import { backend_url } from "../configuration/app.config"; 

// Cliente base
const api = axios.create({
  baseURL: `${backend_url}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// GET (listado o con filtros)
export const getGeneric = async (endpoint, params = {}, headers = {}) => {
  if (!endpoint) throw new Error("Endpoint no definido");

  try {
    const response = await api.get(endpoint, { params, headers });
    return response.data;
  } catch (error) {
    console.error(`Error en getGeneric (${endpoint}):`, error.response?.data || error.message);
    throw error;
  }
};

// GET por ID
export const getByIdGeneric = async (endpoint, id, headers = {}, params = {}) => {
  if (!endpoint) throw new Error("Endpoint no definido");
  if (!id) throw new Error("ID no definido");

  try {
    const response = await api.get(`${endpoint}/${id}`, { headers, params });
    return response.data;
  } catch (error) {
    console.error(`Error en getByIdGeneric (${endpoint}/${id}):`, error.response?.data || error.message);
    throw error;
  }
};

// POST
export const postGeneric = async (endpoint, data, headers = {}, params = {}) => {
  if (!endpoint) throw new Error("Endpoint no definido");

  try {
    const response = await api.post(endpoint, data, { headers, params });
    return response.data;
  } catch (error) {
    console.error(`Error en postGeneric (${endpoint}):`, error.response?.data || error.message);
    throw error;
  }
};

// PUT
export const putGeneric = async (endpoint, id, data, headers = {}, params = {}) => {
  if (!endpoint) throw new Error("Endpoint no definido");
  if (!id) throw new Error("ID no definido");

  try {
    const response = await api.put(`${endpoint}/${id}`, data, { headers, params });
    return response.data;
  } catch (error) {
    console.error(`Error en putGeneric (${endpoint}/${id}):`, error.response?.data || error.message);
    throw error;
  }
};

// DELETE
export const deleteGeneric = async (endpoint, id, headers = {}, params = {}) => {
  if (!endpoint) throw new Error("Endpoint no definido");
  if (!id) throw new Error("ID no definido");

  try {
    const response = await api.delete(`${endpoint}/${id}`, { headers, params });
    return response.data;
  } catch (error) {
    console.error(`Error en deleteGeneric (${endpoint}/${id}):`, error.response?.data || error.message);
    throw error;
  }
};

