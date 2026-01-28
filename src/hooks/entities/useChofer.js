import { useState, useEffect, useCallback } from "react";
import {
  getChofer,
  postChofer,
  putChofer,
  deleteChofer,
} from "../../services/choferService";

/**
 * Normaliza los datos del chofer desde el backend
 * El backend devuelve: { success, data: { idChofer, persona: {...} } }
 */
const normalizeChofer = (chofer) => {
  if (!chofer) return chofer;

  return {
    ...chofer,
    id: chofer.idChofer,
    nombre: chofer.persona?.nombre || chofer.nombre || "",
    apellido: chofer.persona?.apellido || chofer.apellido || "",
    cuit: chofer.persona?.cuit || chofer.cuit || "",
    telefono: chofer.persona?.telefono || chofer.telefono || "",
    dni: chofer.dni || "",
    nombreCompleto:
      `${chofer.persona?.nombre || chofer.nombre || ""} ${chofer.persona?.apellido || chofer.apellido || ""}`.trim(),
  };
};

/**
 * Extrae la lista de choferes desde diferentes estructuras de respuesta
 */
const extractChoferes = (response) => {
  // Caso 1: { success: true, data: [...] }
  if (response?.success && Array.isArray(response.data)) {
    return response.data.map(normalizeChofer);
  }

  // Caso 2: Array directo
  if (Array.isArray(response)) {
    return response.map(normalizeChofer);
  }

  // Caso 3: { data: [...] }
  if (Array.isArray(response?.data)) {
    return response.data.map(normalizeChofer);
  }

  return [];
};

export const useChofer = () => {
  const [choferes, setChoferes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const fetchChoferes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getChofer();
      setChoferes(extractChoferes(response));
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";
      setError(errorMsg);
      console.error("Error al cargar choferes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChoferes();
  }, [fetchChoferes]);

  const handleCreate = async (data) => {
    setLoadingCreate(true);
    setError(null);
    try {
      console.log("Creating chofer with data:", data);

      await postChofer(data);
      await fetchChoferes(); // Recarga la lista completa

      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";

      setError(errorMsg);
      console.error("Error al crear chofer:", err);
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
      console.log("Updating chofer ID:", id);
      console.log("Update data:", data);

      await putChofer(id, data);
      await fetchChoferes(); // Recarga la lista

      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";

      setError(errorMsg);
      console.error("Error al actualizar chofer:", err);
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
      console.log("Deleting chofer ID:", id);
      await deleteChofer(id);

      // Actualización optimista
      setChoferes((prev) =>
        prev.filter((c) => c.id !== id && c.idChofer !== id),
      );

      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";
      setError(errorMsg);
      console.error("Error al eliminar chofer:", err);
      console.error("Error response:", err?.response?.data);
      return { success: false, error: errorMsg };
    } finally {
      setLoadingDelete(false);
    }
  };

  return {
    choferes,
    loading,
    error,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch: fetchChoferes,
  };
};
