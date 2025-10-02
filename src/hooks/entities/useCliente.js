import {
  getCliente,
  postCliente,
  putCliente,
  deleteCliente,
} from "../../services/clienteService";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useParametrosGenerales } from "../useParametrosGenerales";

export const useCliente = () => {
  const [cliente, setCliente] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // A chequear que esto se utilice
  //   const { pagina, itemsPorPagina, empresaId } = useParametrosGenerales();

  useEffect(() => {
    fetchData();
  }, [pagina]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getCliente(1, 100, 1);
      setCliente(response.payload.rows);
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar cliente:", err);
      Swal.fire({
        title: "Error",
        text: err.message || "No se pudieron cargar los clientes",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#592673",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (nuevoCliente) => {
    try {
      setIsLoading(true);
      await postCliente({ ...nuevoCliente, empresaId });
      await fetchData();
      Swal.fire({
        title: "Éxito",
        text: "Cliente creado correctamente",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#592673",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: err.message || "No se pudo crear el cliente",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#592673",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id, datosActualizados) => {
    try {
      setIsLoading(true);
      await putCliente(id, datosActualizados);
      await fetchData();
      Swal.fire({
        title: "Éxito",
        text: "Cliente actualizado correctamente",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#592673",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: err.message || "No se pudo actualizar la cliente",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#592673",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#592673",
      cancelButtonColor: "#ff0000",
      reverseButtons: true,
    });

    if (confirm.isConfirmed) {
      try {
        setIsLoading(true);
        await deleteCliente(id);
        await fetchData();
        Swal.fire({
          title: "Eliminado",
          text: "Cliente eliminado correctamente",
          icon: "success",
          confirmButtonText: "Ok",
          confirmButtonColor: "#592673",
        });
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: "Error",
          text: err.message || "No se pudo eliminar la cliente",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "#592673",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    cliente,
    isLoading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch: fetchData,
  };
};
