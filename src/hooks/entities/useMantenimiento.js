import { useState, useEffect, useCallback } from "react";
import {
  getMantenimiento,
  postMantenimiento,
  putMantenimiento,
  deleteMantenimiento,
} from "../../services/mantenimientoService";

// Normaliza un mantenimiento para asegurar estructura consistente
const normalizeMantenimiento = (mantenimiento) => {
  if (!mantenimiento) return mantenimiento;

  return {
    ...mantenimiento,
    idMantenimiento: mantenimiento.idMantenimiento ?? mantenimiento.id,
    fechaInicio: mantenimiento.fechaInicio ?? "",
    fechaFin: mantenimiento.fechaFin ?? "",
    observaciones: mantenimiento.observaciones ?? mantenimiento.observacion ?? "",
    tipo: mantenimiento.tipo ?? "",
    vehiculo: mantenimiento.vehiculo ?? null,
    idVehiculo: mantenimiento.idVehiculo ?? mantenimiento.vehiculo?.idVehiculo ?? null,
  };
};

// Extrae la lista de mantenimientos de diferentes formatos de respuesta
const extractMantenimientos = (response) => {
  const list = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

  return list.map(normalizeMantenimiento);
};

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
      setMantenimientos(extractMantenimientos(response));
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
      console.log("Creating mantenimiento with data:", data);

      await postMantenimiento(data);
      await fetchMantenimientos(); // Recarga la lista completa

      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";

      setError(errorMsg);
      console.error("Error al crear mantenimiento:", err);

      return { success: false, error: errorMsg };
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleUpdate = async (id, data, selectedMantenimiento) => {
    setLoadingUpdate(true);
    setError(null);

    try {
      const payload = {};

      // Solo envía campos modificados
      Object.keys(data).forEach((key) => {
        const newValue = data[key];
        const oldValue = selectedMantenimiento?.[key];

        if (newValue !== oldValue && newValue !== undefined && newValue !== "") {
          payload[key] = newValue;
        }
      });

      console.log("Updating mantenimiento with payload:", payload);

      if (Object.keys(payload).length === 0) {
        return { success: true, message: "No hay cambios para actualizar" };
      }

      await putMantenimiento(id, payload);
      await fetchMantenimientos(); // Recarga la lista completa

      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";

      setError(errorMsg);
      console.error("Error al actualizar mantenimiento:", err);

      return { success: false, error: errorMsg };
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    setError(null);

    try {
      await deleteMantenimiento(id);
      setMantenimientos((prev) =>
        prev.filter((m) => m.idMantenimiento !== id && m.id !== id)
      );

      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";

      setError(errorMsg);
      console.error("Error al eliminar mantenimiento:", err);

      return { success: false, error: errorMsg };
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
