import { useState, useEffect, useCallback } from "react";
import { getLocalidades } from "../../services/localidadService";

// Normaliza una localidad para asegurar estructura consistente
const normalizeLocalidad = (localidad) => {
  if (!localidad) return localidad;

  return {
    ...localidad,
    idLocalidad: localidad.idLocalidad ?? localidad.id,
    localidad: localidad.localidad ?? "",
    codPostal: localidad.codPostal ?? null,
    provincia: localidad.provincia ?? "",
  };
};

// Extrae la lista de localidades de diferentes formatos de respuesta
const extractLocalidades = (response) => {
  const list = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

  return list.map(normalizeLocalidad);
};

export const useLocalidad = () => {
  const [localidades, setLocalidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLocalidades = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getLocalidades();
      setLocalidades(extractLocalidades(response));
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al cargar localidades:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocalidades();
  }, [fetchLocalidades]);

  return {
    localidades,
    loading,
    error,
    refetch: fetchLocalidades,
  };
};
