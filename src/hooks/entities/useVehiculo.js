import { useState, useEffect, useCallback } from "react";
import {
  getVehiculo,
  postVehiculo,
  putVehiculo,
  deleteVehiculo,
} from "../../services/vehiculoService";

export const useVehiculo = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const fetchVehiculos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getVehiculo();
      setVehiculos(Array.isArray(response) ? response : response.data || []);
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al cargar vehiculos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehiculos();
  }, [fetchVehiculos]);

  const handleCreate = async (data) => {
    setLoadingCreate(true);
    setError(null);
    try {
      const response = await postVehiculo(data);
      const nuevo = response.data;
      if (nuevo) setVehiculos((prev) => [...prev, nuevo]);
      return { success: true, data: nuevo };
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al crear vehiculo:", err);
      return { success: false, error: err.message };
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleUpdate = async (id, data) => {
    setLoadingUpdate(true);
    setError(null);
    try {
      const response = await putVehiculo(id, data);
      const actualizado = response.data;
      if (actualizado) {
        setVehiculos((prev) =>
          prev.map((v) => (v.id === id ? actualizado : v))
        );
      }
      return { success: true, data: actualizado };
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al actualizar vehiculo:", err);
      return { success: false, error: err.message };
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    setError(null);
    try {
      await deleteVehiculo(id);
      setVehiculos((prev) => prev.filter((v) => v.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al eliminar vehiculo:", err);
      return { success: false, error: err.message };
    } finally {
      setLoadingDelete(false);
    }
  };

  return {
    vehiculos,
    loading,
    error,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch: fetchVehiculos,
  };
};
