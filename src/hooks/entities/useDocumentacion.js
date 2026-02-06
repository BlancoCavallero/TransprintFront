import { useState, useCallback, useEffect } from 'react';
import {
  getDocumentacion,
  postDocumentacion,
  putDocumentacion,
  deleteDocumentacion,
} from '../../services/documentacionService';

// Helper para normalizar documentación (manejo de campos con diferentes nombres)
const normalizeDocumentacion = (doc) => {
  if (!doc) return null;
  
  return {
    idDocumentacion: doc.idDocumentacion || doc.id,
    detalle: doc.detalle || '',
    nombre: doc.nombre || '',
    tipoEntidad: doc.tipoEntidad || '',
    renovacion: doc.renovacion || null,
    fechaVencimiento: doc.fechaVencimiento || '',
    estado: doc.estado || '',
    vehiculo: doc.vehiculo || null,
    chofer: doc.chofer || null,
    idVehiculo: doc.idVehiculo || doc.vehiculo?.idVehiculo || null,
    idChofer: doc.idChofer || doc.chofer?.idChofer || null,
  };
};

// Helper para extraer y normalizar array de documentaciones
const extractDocumentaciones = (response) => {
  if (!response) return [];
  
  // Si response.data es un array
  if (Array.isArray(response.data)) {
    return response.data.map(normalizeDocumentacion);
  }
  
  // Si response es un array directamente
  if (Array.isArray(response)) {
    return response.map(normalizeDocumentacion);
  }
  
  return [];
};

export const useDocumentacion = (idEntidad = null, tipoEntidad = null) => {
  const [documentaciones, setDocumentaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const fetchDocumentaciones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDocumentacion();
      let docs = extractDocumentaciones(response);
      
      // Filtrar por entidad si se especifica
      if (idEntidad && tipoEntidad) {
        docs = docs.filter(doc => {
          if (tipoEntidad === 'CHOFER') {
            return doc.idChofer === idEntidad && doc.tipoEntidad === 'CHOFER';
          } else if (tipoEntidad === 'VEHICULO') {
            return doc.idVehiculo === idEntidad && doc.tipoEntidad === 'VEHICULO';
          }
          return false;
        });
      }
      
      setDocumentaciones(docs);
    } catch (err) {
      console.error('Error al cargar documentaciones:', err);
      setError(err.message || 'Error al cargar documentaciones');
    } finally {
      setLoading(false);
    }
  }, [idEntidad, tipoEntidad]);

  useEffect(() => {
    fetchDocumentaciones();
  }, [fetchDocumentaciones]);

  const handleCreate = async (data) => {
    setLoadingCreate(true);
    try {
      await postDocumentacion(data);
      await fetchDocumentaciones();
      return { success: true };
    } catch (err) {
      console.error('Error al crear documentación:', err);
      return { success: false, error: err.message };
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleUpdate = async (id, data, originalData = null) => {
    setLoadingUpdate(true);
    try {
      await putDocumentacion(id, data);
      await fetchDocumentaciones();
      return { success: true };
    } catch (err) {
      console.error('Error al actualizar documentación:', err);
      return { success: false, error: err.message };
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    try {
      await deleteDocumentacion(id);
      await fetchDocumentaciones();
      return { success: true };
    } catch (err) {
      console.error('Error al eliminar documentación:', err);
      return { success: false, error: err.message };
    } finally {
      setLoadingDelete(false);
    }
  };

  const refetch = useCallback(() => {
    fetchDocumentaciones();
  }, [fetchDocumentaciones]);

  return {
    documentaciones,
    loading,
    error,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch,
  };
};
