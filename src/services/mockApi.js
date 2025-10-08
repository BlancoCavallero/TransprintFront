const clientesMock = [
  { id: 1, nombre: "Juan Pérez", empresaId: 1, email: "juan@ejemplo.com" },
  { id: 2, nombre: "María Gómez", empresaId: 1, email: "maria@ejemplo.com" },
  { id: 3, nombre: "Carlos Ruiz", empresaId: 2, email: "carlos@ejemplo.com" },
];

export const getCliente = async (pagina, itemsPorPagina, empresaId) => {
  // Filtra y pagina los datos mock
  const filtrados = clientesMock.filter((c) => c.empresaId === empresaId);
  const inicio = (pagina - 1) * itemsPorPagina;
  const paginados = filtrados.slice(inicio, inicio + itemsPorPagina);

  return {
    data: paginados,
    total: filtrados.length,
    pagina,
    itemsPorPagina,
  };
};

export const postCliente = async (data) => {
  const nuevo = { id: Date.now(), ...data };
  clientesMock.push(nuevo);
  return { data: nuevo, message: "Cliente agregado exitosamente (mock)" };
};

export const putCliente = async (id, data) => {
  const index = clientesMock.findIndex((c) => c.id === id);
  if (index !== -1) {
    clientesMock[index] = { ...clientesMock[index], ...data };
    return { data: clientesMock[index], message: "Cliente actualizado (mock)" };
  }
  throw new Error("Cliente no encontrado (mock)");
};

export const deleteCliente = async (id) => {
  const index = clientesMock.findIndex((c) => c.id === id);
  if (index !== -1) {
    clientesMock.splice(index, 1);
    return { message: "Cliente eliminado (mock)" };
  }
  throw new Error("Cliente no encontrado (mock)");
};
