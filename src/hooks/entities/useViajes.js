import { useState, useEffect, useCallback } from "react";
import {
  getViajes,
  postViajes,
  putViajes,
  deleteViajes,
} from "../../services/viajesService";

export const useViajes = () => {
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const fetchViajes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getViajes();
      setViajes(Array.isArray(response) ? response : response.data || []);
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al cargar viajes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchViajes();
  }, [fetchViajes]);

  const handleCreate = async (data) => {
    setLoadingCreate(true);
    setError(null);
    try {
      const response = await postViajes(data);
      const nuevo = response.data;
      if (nuevo) setViajes((prev) => [...prev, nuevo]);
      return { success: true, data: nuevo };
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al crear viaje:", err);
      return { success: false, error: err.message };
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleUpdate = async (id, data) => {
    setLoadingUpdate(true);
    setError(null);
    try {
      const response = await putViajes(id, data);
      const actualizado = response.data;
      if (actualizado) {
        setViajes((prev) => prev.map((v) => (v.id === id ? actualizado : v)));
      }
      return { success: true, data: actualizado };
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al actualizar viaje:", err);
      return { success: false, error: err.message };
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    setError(null);
    try {
      await deleteViajes(id);
      setViajes((prev) => prev.filter((v) => v.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al eliminar viaje:", err);
      return { success: false, error: err.message };
    } finally {
      setLoadingDelete(false);
    }
  };

  return {
    viajes,
    loading,
    error,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch: fetchViajes,
  };
};
