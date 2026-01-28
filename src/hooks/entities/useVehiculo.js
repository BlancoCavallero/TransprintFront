import { useState, useEffect, useCallback } from "react";
import {
  getVehiculo,
  postVehiculo,
  putVehiculo,
  deleteVehiculo,
} from "../../services/vehiculoService";

// Normaliza un vehículo para asegurar estructura consistente
const normalizeVehiculo = (vehiculo) => {
  if (!vehiculo) return vehiculo;

  return {
    ...vehiculo,
    idVehiculo: vehiculo.idVehiculo ?? vehiculo.id,
    patente: vehiculo.patente ?? "",
    marca: vehiculo.marca ?? "",
    modelo: vehiculo.modelo ?? "",
    anio: vehiculo.anio ?? null,
    estado: vehiculo.estado ?? "",
    tipo: vehiculo.tipo ?? "",
  };
};

// Extrae la lista de vehículos de diferentes formatos de respuesta
const extractVehiculos = (response) => {
  const list = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

  return list.map(normalizeVehiculo);
};

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
      setVehiculos(extractVehiculos(response));
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
      console.log("Creating vehiculo with data:", data);

      await postVehiculo(data);
      await fetchVehiculos(); // Recarga la lista completa

      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";

      setError(errorMsg);
      console.error("Error al crear vehiculo:", err);

      return { success: false, error: errorMsg };
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleUpdate = async (id, data, selectedVehiculo) => {
    setLoadingUpdate(true);
    setError(null);

    try {
      const payload = {};

      // Solo envía campos modificados
      Object.keys(data).forEach((key) => {
        const newValue = data[key];
        const oldValue = selectedVehiculo?.[key];

        if (newValue === "" || newValue == null) return;
        if (newValue === oldValue) return;

        payload[key] = newValue;
      });

      console.log("Updating vehiculo ID:", id);
      console.log("Final payload:", payload);

      await putVehiculo(id, payload);
      await fetchVehiculos(); // Recarga lista

      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";

      setError(errorMsg);
      console.error("Error al actualizar vehiculo:", err);

      return { success: false, error: errorMsg };
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    setError(null);
    try {
      console.log("Deleting vehiculo ID:", id);
      await deleteVehiculo(id);

      // Actualización optimista del estado local
      setVehiculos((prev) => prev.filter((v) => v.idVehiculo !== id));

      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";
      setError(errorMsg);
      console.error("Error al eliminar vehiculo:", err);
      return { success: false, error: errorMsg };
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
