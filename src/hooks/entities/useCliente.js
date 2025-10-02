import {
  getCliente,
  postCliente,
  putCliente,
  deleteCliente,
} from "../../services/clienteService";
import { useState, useEffect, useCallback } from "react";

// import { useParametrosGenerales } from "../useParametrosGenerales";

// export const useCliente = () => {
//   const [cliente, setCliente] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // A chequear que esto se utilice
//   //   const { pagina, itemsPorPagina, empresaId } = useParametrosGenerales();

//   useEffect(() => {
//     fetchData();
//   }, [pagina]);

//   const fetchData = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       const response = await getCliente(1, 100, 1);
//       setCliente(response.payload.rows);
//     } catch (err) {
//       setError(err.message);
//       console.error("Error al cargar cliente:", err);
//       Swal.fire({
//         title: "Error",
//         text: err.message || "No se pudieron cargar los clientes",
//         icon: "error",
//         confirmButtonText: "Ok",
//         confirmButtonColor: "#592673",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCreate = async (nuevoCliente) => {
//     try {
//       setIsLoading(true);
//       await postCliente({ ...nuevoCliente, empresaId });
//       await fetchData();
//       Swal.fire({
//         title: "Éxito",
//         text: "Cliente creado correctamente",
//         icon: "success",
//         confirmButtonText: "Ok",
//         confirmButtonColor: "#592673",
//       });
//     } catch (err) {
//       console.error(err);
//       Swal.fire({
//         title: "Error",
//         text: err.message || "No se pudo crear el cliente",
//         icon: "error",
//         confirmButtonText: "Ok",
//         confirmButtonColor: "#592673",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleUpdate = async (id, datosActualizados) => {
//     try {
//       setIsLoading(true);
//       await putCliente(id, datosActualizados);
//       await fetchData();
//       Swal.fire({
//         title: "Éxito",
//         text: "Cliente actualizado correctamente",
//         icon: "success",
//         confirmButtonText: "Ok",
//         confirmButtonColor: "#592673",
//       });
//     } catch (err) {
//       console.error(err);
//       Swal.fire({
//         title: "Error",
//         text: err.message || "No se pudo actualizar la cliente",
//         icon: "error",
//         confirmButtonText: "Ok",
//         confirmButtonColor: "#592673",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     const confirm = await Swal.fire({
//       title: "¿Estás seguro?",
//       text: "Esta acción no se puede deshacer",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Sí, eliminar",
//       cancelButtonText: "Cancelar",
//       confirmButtonColor: "#592673",
//       cancelButtonColor: "#ff0000",
//       reverseButtons: true,
//     });

//     if (confirm.isConfirmed) {
//       try {
//         setIsLoading(true);
//         await deleteCliente(id);
//         await fetchData();
//         Swal.fire({
//           title: "Eliminado",
//           text: "Cliente eliminado correctamente",
//           icon: "success",
//           confirmButtonText: "Ok",
//           confirmButtonColor: "#592673",
//         });
//       } catch (err) {
//         console.error(err);
//         Swal.fire({
//           title: "Error",
//           text: err.message || "No se pudo eliminar la cliente",
//           icon: "error",
//           confirmButtonText: "Ok",
//           confirmButtonColor: "#592673",
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   return {
//     cliente,
//     isLoading,
//     error,
//     handleCreate,
//     handleUpdate,
//     handleDelete,
//     refetch: fetchData,
//   };
// };

export const useCliente = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCliente(); // Asumimos que devuelve todos los clientes
      setClientes(response.data || []); // Verificá si `response` tiene .data
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al cargar clientes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const handleCreate = async (clienteData) => {
    setLoadingCreate(true);
    setError(null);
    try {
      const nuevoCliente = await postCliente(clienteData);
      setClientes((prev) => [...prev, nuevoCliente]);
      return { success: true, data: nuevoCliente };
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al crear cliente:", err);
      return { success: false, error: err.message };
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleUpdate = async (id, clienteData) => {
    setLoadingUpdate(true);
    setError(null);
    try {
      const clienteActualizado = await putCliente(id, clienteData);
      setClientes((prev) =>
        prev.map((cliente) =>
          cliente.id === id ? clienteActualizado : cliente
        )
      );
      return { success: true, data: clienteActualizado };
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al actualizar cliente:", err);
      return { success: false, error: err.message };
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    setError(null);
    try {
      await deleteCliente(id);
      setClientes((prev) => prev.filter((cliente) => cliente.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message || "Error desconocido");
      console.error("Error al eliminar cliente:", err);
      return { success: false, error: err.message };
    } finally {
      setLoadingDelete(false);
    }
  };

  return {
    clientes,
    loading,
    error,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch: fetchClientes,
  };
};
