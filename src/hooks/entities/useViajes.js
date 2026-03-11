import { useState, useEffect, useCallback } from "react";
import {
  getViajes,
  postViajes,
  putViajes,
  deleteViajes,
} from "../../services/viajesService";

// Normaliza un viaje para asegurar estructura consistente
const normalizeViaje = (viaje) => {
  if (!viaje) return viaje;

  return {
    ...viaje,
    idViaje: viaje.idViaje ?? viaje.id,
    estado: viaje.estado ?? "",
    fechaInicio: viaje.fechaInicio ?? "",
    fechaFin: viaje.fechaFin ?? "",
    kilometros: viaje.kilometros ?? 0,
    observaciones: viaje.observaciones ?? null,
    motivoCancelacion: viaje.motivoCancelacion ?? null,
    precio: viaje.precio ?? 0,
    idLocalidadOrigen: viaje.idLocalidadOrigen ?? null,
    idLocalidadDestino: viaje.idLocalidadDestino ?? null,
    idCliente: viaje.idCliente ?? null,
    cliente: viaje.cliente ?? null,
    idChofer: viaje.idChofer ?? null,
    chofer: viaje.chofer ?? null,
    idVehiculo: viaje.idVehiculo ?? null,
    vehiculo: viaje.vehiculo ?? null,
    gastos: viaje.gastos ?? [],
  };
};

// Extrae la lista de viajes de diferentes formatos de respuesta
const extractViajes = (response) => {
  const list = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

  return list.map(normalizeViaje);
};

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
      setViajes(extractViajes(response));
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
      console.log("Creating viaje with data:", data);

      await postViajes(data);
      await fetchViajes(); // Recarga la lista completa

      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";

      setError(errorMsg);
      console.error("Error al crear viaje:", err);

      return { success: false, error: errorMsg };
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleUpdate = async (id, data, selectedViaje) => {
    setLoadingUpdate(true);
    setError(null);

    try {
      const payload = {};

      // Solo envía campos modificados
      Object.keys(data).forEach((key) => {
        const newValue = data[key];
        const oldValue = selectedViaje?.[key];

        if (newValue !== oldValue && newValue !== undefined && newValue !== "") {
          payload[key] = newValue;
        }
      });

      console.log("Updating viaje with payload:", payload);

      if (Object.keys(payload).length === 0) {
        return { success: true, message: "No hay cambios para actualizar" };
      }

      await putViajes(id, payload);
      await fetchViajes(); // Recarga la lista completa

      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";

      setError(errorMsg);
      console.error("Error al actualizar viaje:", err);

      return { success: false, error: errorMsg };
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    setError(null);

    try {
      await deleteViajes(id);
      setViajes((prev) =>
        prev.filter((v) => v.idViaje !== id && v.id !== id)
      );

      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";

      setError(errorMsg);
      console.error("Error al eliminar viaje:", err);

      return { success: false, error: errorMsg };
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
