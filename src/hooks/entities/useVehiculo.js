import { useState, useEffect, useCallback } from "react";
import {
  getVehiculo,
  postVehiculo,
  putVehiculo,
  deleteVehiculo,
  bajaVehiculo,
  reactivarVehiculo,
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

export const useVehiculo = (params = {}) => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingBaja, setLoadingBaja] = useState(false);
  const [loadingReactivar, setLoadingReactivar] = useState(false);

  const fetchVehiculos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getVehiculo(params);
      setVehiculos(extractVehiculos(response));
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al cargar vehiculos:", err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchVehiculos();
  }, [fetchVehiculos]);

  const handleCreate = async (data) => {
    setLoadingCreate(true);
    setError(null);

    try {
      console.log("Enviando la data de los vehiculos", data);

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

  const handleBaja = async (id) => {
    setLoadingBaja(true);
    setError(null);
    try {
      console.log("Dando de baja vehiculo ID:", id);
      await bajaVehiculo(id);
      await fetchVehiculos(); // Recarga la lista

      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";
      setError(errorMsg);
      console.error("Error al dar de baja vehiculo:", err);
      return { success: false, error: errorMsg };
    } finally {
      setLoadingBaja(false);
    }
  };

  const handleReactivar = async (id) => {
    setLoadingReactivar(true);
    setError(null);
    try {
      console.log("Reactivando vehiculo ID:", id);
      await reactivarVehiculo(id);
      await fetchVehiculos(); // Recarga la lista

      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";
      setError(errorMsg);
      console.error("Error al reactivar vehiculo:", err);
      return { success: false, error: errorMsg };
    } finally {
      setLoadingReactivar(false);
    }
  };

  return {
    vehiculos,
    loading,
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
    refetch: fetchVehiculos,
  };
};
