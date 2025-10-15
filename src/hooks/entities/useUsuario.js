import { useState, useEffect, useCallback } from "react";
import {
  getUsuario,
  postUsuario,
  putUsuario,
  deleteUsuario,
} from "../../services/usuarioService";

export const useUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsuario();
      setUsuarios(Array.isArray(response) ? response : response.data || []);
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al cargar usuarios:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const handleCreate = async (data) => {
    setLoadingCreate(true);
    setError(null);
    try {
      const response = await postUsuario(data);
      const nuevo = response.data;
      if (nuevo) setUsuarios((prev) => [...prev, nuevo]);
      return { success: true, data: nuevo };
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al crear usuario:", err);
      return { success: false, error: err.message };
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleUpdate = async (id, data) => {
    setLoadingUpdate(true);
    setError(null);
    try {
      const response = await putUsuario(id, data);
      const actualizado = response.data;
      if (actualizado) {
        setUsuarios((prev) => prev.map((u) => (u.id === id ? actualizado : u)));
      }
      return { success: true, data: actualizado };
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al actualizar usuario:", err);
      return { success: false, error: err.message };
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    setError(null);
    try {
      await deleteUsuario(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al eliminar usuario:", err);
      return { success: false, error: err.message };
    } finally {
      setLoadingDelete(false);
    }
  };

  return {
    usuarios,
    loading,
    error,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch: fetchUsuarios,
  };
};
