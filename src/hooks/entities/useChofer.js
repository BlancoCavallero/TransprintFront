import {
  getChofer,
  postChofer,
  putChofer,
  deleteChofer,
} from "../../services/mock/mockApi"; //USO MOCK
import { useState, useEffect, useCallback } from "react";

export const useCliente = () => {
  const [chofer, setChofer] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const fetchChofer = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getChofer();
      // Soporta tanto arrays como objetos { data: [...] }
      setChofer(Array.isArray(response) ? response : response.data || []);
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al cargar chofer:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChofer();
  }, [fetchChofer]);

  const handleCreate = async (choferData) => {
    setLoadingCreate(true);
    setError(null);
    try {
      const response = await postChofer(choferData);
      const nuevoCliente = response.data;
      if (nuevoCliente) setChofer((prev) => [...prev, nuevoCliente]);
      return { success: true, data: nuevoCliente };
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al crear cliente:", err);
      return { success: false, error: err.message };
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleUpdate = async (id, choferData) => {
    setLoadingUpdate(true);
    setError(null);
    try {
      const response = await putChofer(id, choferData);
      const choferActualizado = response.data;
      if (choferActualizado) {
        setChofer((prev) =>
          prev.map((cliente) =>
            cliente.id === id ? choferActualizado : cliente
          )
        );
      }
      return { success: true, data: choferActualizado };
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al actualizar chofer:", err);
      return { success: false, error: err.message };
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    setError(null);
    try {
      await deleteChofer(id);
      setChofer((prev) => prev.filter((chofer) => chofer.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al eliminar chofer:", err);
      return { success: false, error: err.message };
    } finally {
      setLoadingDelete(false);
    }
  };

  return {
    chofer,
    loading,
    error,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch: fetchChofer,
  };
};
