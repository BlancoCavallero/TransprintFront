import { useState, useEffect, useCallback } from "react";
import {
  getUsuario,
  postUsuario,
  putUsuario,
  deleteUsuario,
} from "../../services/usuarioService";

const normalizeUser = (user) => {
  if (!user) return user;
  const roleFromArray = Array.isArray(user.roles) ? user.roles[0] : undefined;

  return {
    ...user,
    user_id: user.user_id ?? user.id,
    role: user.role ?? roleFromArray ?? "",
  };
};

const extractUsers = (response) => {
  const list = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

  return list.map(normalizeUser);
};

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
      const usuariosList = extractUsers(response);
      setUsuarios(usuariosList);
      console.log("Usuarios cargados:", usuariosList);
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
      console.log("Creating user with data:", data);

      await postUsuario(data); // no usamos lo que devuelve
      await fetchUsuarios(); // traemos lista completa real

      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";

      setError(errorMsg);
      console.error("Error al crear usuario:", err);
      console.error("Error response:", err?.response?.data);

      return { success: false, error: errorMsg };
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleUpdate = async (id, data, selectedUsuario) => {
    setLoadingUpdate(true);
    setError(null);

    try {
      const payload = {};

      Object.keys(data).forEach((key) => {
        const newValue = data[key];
        const oldValue = selectedUsuario[key];

        if (newValue === "" || newValue == null) return;
        if (newValue === oldValue) return;

        payload[key] = newValue;
      });

      if (!data.password || data.password.trim() === "") {
        delete payload.password;
      }

      console.log("Updating user ID:", id);
      console.log("Final payload:", payload);

      await putUsuario(id, payload); // no usamos respuesta parcial
      await fetchUsuarios(); // estado completo desde backend

      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";

      setError(errorMsg);
      console.error("Error al actualizar usuario:", err);
      console.error("Error response:", err?.response?.data);

      return { success: false, error: errorMsg };
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    setError(null);
    try {
      console.log("Deleting user ID:", id);
      await deleteUsuario(id);
      setUsuarios((prev) => prev.filter((u) => u.user_id !== id));
      return { success: true };
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Error desconocido";
      setError(errorMsg);
      console.error("Error al eliminar usuario:", err);
      console.error("Error response:", err?.response?.data);
      return { success: false, error: errorMsg };
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
