import { useState, useCallback } from "react";
import {
  getExpenses,
  postExpenses,
  putExpenses,
  deleteExpenses,
} from "../../services/expensesService";

// Normaliza un gasto para asegurar estructura consistente
const normalizeGasto = (gasto) => {
  if (!gasto) return gasto;

  return {
    ...gasto,
    idGasto: gasto.idGasto ?? gasto.id,
    detalle: gasto.detalle ?? "",
    monto: gasto.monto ?? 0,
    tipo: gasto.tipo ?? "",
    idViaje: gasto.idViaje ?? null,
    viaje: gasto.viaje ?? null,
  };
};

// Extrae la lista de gastos de diferentes formatos de respuesta
const extractGastos = (response) => {
  const list = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

  return list.map(normalizeGasto);
};

export const useGastos = (idViaje = null) => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const fetchGastos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getExpenses();
      let allGastos = extractGastos(response);
      
      // Si se proporciona idViaje, filtrar solo los gastos de ese viaje
      if (idViaje) {
        allGastos = allGastos.filter(g => g.idViaje === idViaje);
      }
      
      setGastos(allGastos);
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al cargar gastos:", err);
    } finally {
      setLoading(false);
    }
  }, [idViaje]);

  const handleCreate = async (data) => {
    setLoadingCreate(true);
    setError(null);

    try {
      console.log("Creating gasto with data:", data);

      await postExpenses(data);
      await fetchGastos(); // Recarga la lista completa

      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";

      setError(errorMsg);
      console.error("Error al crear gasto:", err);

      return { success: false, error: errorMsg };
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleUpdate = async (id, data, selectedGasto) => {
    setLoadingUpdate(true);
    setError(null);

    try {
      const payload = {};

      // Solo envía campos modificados
      Object.keys(data).forEach((key) => {
        const newValue = data[key];
        const oldValue = selectedGasto?.[key];

        if (newValue !== oldValue && newValue !== undefined && newValue !== "") {
          payload[key] = newValue;
        }
      });

      console.log("Updating gasto with payload:", payload);

      if (Object.keys(payload).length === 0) {
        return { success: true, message: "No hay cambios para actualizar" };
      }

      await putExpenses(id, payload);
      await fetchGastos(); // Recarga la lista completa

      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";

      setError(errorMsg);
      console.error("Error al actualizar gasto:", err);

      return { success: false, error: errorMsg };
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    setError(null);

    try {
      await deleteExpenses(id);
      setGastos((prev) =>
        prev.filter((g) => g.idGasto !== id && g.id !== id)
      );

      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";

      setError(errorMsg);
      console.error("Error al eliminar gasto:", err);

      return { success: false, error: errorMsg };
    } finally {
      setLoadingDelete(false);
    }
  };

  return {
    gastos,
    loading,
    error,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch: fetchGastos,
  };
};
