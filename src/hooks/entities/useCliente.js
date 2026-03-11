import { useState, useEffect, useCallback } from "react";
import {
  getCliente,
  postCliente,
  putCliente,
  deleteCliente,
  getLocalidades,
  bajaCliente,
  reactivarCliente,
} from "../../services/clienteService";

/**
 * Normaliza los datos del cliente desde el backend
 * El backend devuelve: { success, data: { idCliente, persona: {...}, localidad: {...} } }
 */
const normalizeCliente = (cliente) => {
  if (!cliente) return cliente;

  return {
    ...cliente,
    id: cliente.idCliente,
    nombre: cliente.persona?.nombre || cliente.nombre || "",
    apellido: cliente.persona?.apellido || cliente.apellido || "",
    cuit: cliente.persona?.cuit || cliente.cuit || "",
    telefono: cliente.persona?.telefono || cliente.telefono || "",
    nombreCompleto:
      `${cliente.persona?.nombre || cliente.nombre || ""} ${cliente.persona?.apellido || cliente.apellido || ""}`.trim(),
  };
};

/**
 * Extrae la lista de clientes desde diferentes estructuras de respuesta
 */
const extractClientes = (response) => {
  // Caso 1: { success: true, data: [...] }
  if (response?.success && Array.isArray(response.data)) {
    return response.data.map(normalizeCliente);
  }

  // Caso 2: Array directo
  if (Array.isArray(response)) {
    return response.map(normalizeCliente);
  }

  // Caso 3: { data: [...] }
  if (Array.isArray(response?.data)) {
    return response.data.map(normalizeCliente);
  }

  return [];
};

export const useCliente = () => {
  const [clientes, setClientes] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingLocalidades, setLoadingLocalidades] = useState(false);
  const [error, setError] = useState(null);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingBaja, setLoadingBaja] = useState(false);
  const [loadingReactivar, setLoadingReactivar] = useState(false);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCliente();
      setClientes(extractClientes(response));
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";
      setError(errorMsg);
      console.error("Error al cargar clientes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLocalidades = useCallback(async () => {
    setLoadingLocalidades(true);
    try {
      const response = await getLocalidades();
      // Extraer localidades: { success: true, data: [...] }
      const localidadesData = response?.data || response || [];
      setLocalidades(localidadesData);
    } catch (err) {
      console.error("Error al cargar localidades:", err);
      // No seteamos error global para localidades, solo log
    } finally {
      setLoadingLocalidades(false);
    }
  }, []);

  useEffect(() => {
    fetchClientes();
    fetchLocalidades();
  }, [fetchClientes, fetchLocalidades]);

  const handleCreate = async (data) => {
    setLoadingCreate(true);
    setError(null);
    try {
      console.log("Creating cliente with data:", data);

      await postCliente(data);
      await fetchClientes(); // Recarga la lista completa

      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";

      setError(errorMsg);
      console.error("Error al crear cliente:", err);
      console.error("Error response:", err?.response?.data);

      return { success: false, error: errorMsg };
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleUpdate = async (id, data) => {
    setLoadingUpdate(true);
    setError(null);
    try {
      console.log("Updating cliente ID:", id);
      console.log("Update data:", data);

      await putCliente(id, data);
      await fetchClientes(); // Recarga la lista

      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";

      setError(errorMsg);
      console.error("Error al actualizar cliente:", err);
      console.error("Error response:", err?.response?.data);

      return { success: false, error: errorMsg };
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    setError(null);
    try {
      console.log("Deleting cliente ID:", id);
      await deleteCliente(id);

      // Actualización optimista
      setClientes((prev) =>
        prev.filter((c) => c.id !== id && c.idCliente !== id),
      );

      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";
      setError(errorMsg);
      console.error("Error al eliminar cliente:", err);
      console.error("Error response:", err?.response?.data);
      return { success: false, error: errorMsg };
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleBaja = async (id) => {
    setLoadingBaja(true);
    setError(null);
    try {
      console.log("Dando de baja cliente ID:", id);
      await bajaCliente(id);
      await fetchClientes(); // Recarga la lista

      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";
      setError(errorMsg);
      console.error("Error al dar de baja cliente:", err);
      return { success: false, error: errorMsg };
    } finally {
      setLoadingBaja(false);
    }
  };

  const handleReactivar = async (id) => {
    setLoadingReactivar(true);
    setError(null);
    try {
      console.log("Reactivando cliente ID:", id);
      await reactivarCliente(id);
      await fetchClientes(); // Recarga la lista

      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";
      setError(errorMsg);
      console.error("Error al reactivar cliente:", err);
      return { success: false, error: errorMsg };
    } finally {
      setLoadingReactivar(false);
    }
  };

  return {
    clientes,
    localidades,
    loading,
    loadingLocalidades,
    error,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    loadingBaja,
    loadingReactivar,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleBaja,
    handleReactivar,
    refetch: fetchClientes,
  };
};