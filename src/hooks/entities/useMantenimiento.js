import { useState, useEffect, useCallback } from "react";
import {
  getMantenimiento,
  postMantenimiento,
  putMantenimiento,
  deleteMantenimiento,
} from "../../services/mantenimientoService";

export const useMantenimiento = () => {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const fetchMantenimientos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMantenimiento();
      setMantenimientos(
        Array.isArray(response) ? response : response.data || []
      );
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al cargar mantenimientos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMantenimientos();
  }, [fetchMantenimientos]);

  const handleCreate = async (data) => {
    setLoadingCreate(true);
    setError(null);
    try {
      const response = await postMantenimiento(data);
      const nuevo = response.data;
      if (nuevo) setMantenimientos((prev) => [...prev, nuevo]);
      return { success: true, data: nuevo };
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al crear mantenimiento:", err);
      return { success: false, error: err.message };
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleUpdate = async (id, data) => {
    setLoadingUpdate(true);
    setError(null);
    try {
      const response = await putMantenimiento(id, data);
      const actualizado = response.data;
      if (actualizado) {
        setMantenimientos((prev) =>
          prev.map((m) => (m.id === id ? actualizado : m))
        );
      }
      return { success: true, data: actualizado };
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al actualizar mantenimiento:", err);
      return { success: false, error: err.message };
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    setError(null);
    try {
      await deleteMantenimiento(id);
      setMantenimientos((prev) => prev.filter((m) => m.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al eliminar mantenimiento:", err);
      return { success: false, error: err.message };
    } finally {
      setLoadingDelete(false);
    }
  };

  return {
    mantenimientos,
    loading,
    error,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch: fetchMantenimientos,
  };
};
