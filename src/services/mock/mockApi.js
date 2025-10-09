const STORAGE_KEY = "mock_clientes";

// ✅ Datos iniciales con empresa
const initialClientes = [
  {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan@example.com",
    telefono: "123456789",
    empresa: "Tech Solutions",
    fechaCreacion: new Date("2023-01-15").toISOString(),
  },
  {
    id: 2,
    nombre: "María Gómez",
    email: "maria@example.com",
    telefono: "987654321",
    empresa: "Global Corp",
    fechaCreacion: new Date("2023-02-20").toISOString(),
  },
  {
    id: 3,
    nombre: "Carlos Sánchez",
    email: "carlos@example.com",
    telefono: "456789123",
    empresa: "Innovate Labs",
    fechaCreacion: new Date("2023-03-10").toISOString(),
  },
  {
    id: 4,
    nombre: "Laura Fernández",
    email: "laura@example.com",
    telefono: "789123456",
    empresa: "Design Studio",
    fechaCreacion: new Date("2023-04-05").toISOString(),
  },
  {
    id: 5,
    nombre: "Ana Torres",
    email: "ana@example.com",
    telefono: "321654987",
    empresa: "Marketing Pro",
    fechaCreacion: new Date("2023-05-12").toISOString(),
  },
  {
    id: 6,
    nombre: "Pedro Ruiz",
    email: "pedro@example.com",
    telefono: "654987321",
    empresa: "Consulting Group",
    fechaCreacion: new Date("2023-06-18").toISOString(),
  },
  {
    id: 7,
    nombre: "Sofía Díaz",
    email: "sofia@example.com",
    telefono: "789456123",
    empresa: "Software SRL",
    fechaCreacion: new Date("2023-07-22").toISOString(),
  },
  {
    id: 8,
    nombre: "Diego López",
    email: "diego@example.com",
    telefono: "147258369",
    empresa: "Data Analytics",
    fechaCreacion: new Date("2023-08-30").toISOString(),
  },
  {
    id: 9,
    nombre: "Lucía Morales",
    email: "lucia@example.com",
    telefono: "369258147",
    empresa: "Web Developers",
    fechaCreacion: new Date("2023-09-14").toISOString(),
  },
  {
    id: 10,
    nombre: "Javier Silva",
    email: "javier@example.com",
    telefono: "258147369",
    empresa: "Cloud Services",
    fechaCreacion: new Date("2023-10-25").toISOString(),
  },
  {
    id: 11,
    nombre: "Carolina Castro",
    email: "carolina@example.com",
    telefono: "951753486",
    empresa: "Mobile Apps",
    fechaCreacion: new Date("2023-11-08").toISOString(),
  },
];

// ✅ Configuración
const CONFIG = {
  minDelay: 200,
  maxDelay: 800,
  enableRandomErrors: false,
  errorProbability: 0.1,
};

// ✅ Utilidades
const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

const randomDelay = () => {
  const delay =
    Math.random() * (CONFIG.maxDelay - CONFIG.minDelay) + CONFIG.minDelay;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

const simulateError = () => {
  if (CONFIG.enableRandomErrors && Math.random() < CONFIG.errorProbability) {
    throw new Error("Error simulado en la API");
  }
};

// ✅ Validaciones
const validateCliente = (cliente) => {
  const errors = [];

  if (!cliente.nombre || cliente.nombre.trim().length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres");
  }

  if (!cliente.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.email)) {
    errors.push("El email no es válido");
  }

  if (!cliente.telefono || cliente.telefono.trim().length < 8) {
    errors.push("El teléfono debe tener al menos 8 caracteres");
  }

  if (errors.length > 0) {
    throw new Error(`Errores de validación: ${errors.join(", ")}`);
  }
};

const checkDuplicateEmail = (email, currentId = null) => {
  const clientes = loadClientes();
  return clientes.some(
    (cliente) => cliente.email === email && cliente.id !== currentId
  );
};

// ✅ Gestión de almacenamiento
const loadClientes = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [...initialClientes];
  } catch (error) {
    console.error("Error cargando clientes:", error);
    return [...initialClientes];
  }
};

const saveClientes = (clientes) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));
  } catch (error) {
    console.error("Error guardando clientes:", error);
    throw new Error("No se pudieron guardar los datos");
  }
};

// ✅ Operaciones CRUD
export const getClientes = async (filters = {}) => {
  await randomDelay();
  simulateError();

  let clientes = loadClientes();

  // Filtrado por búsqueda
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    clientes = clientes.filter(
      (c) =>
        c.nombre.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        c.empresa.toLowerCase().includes(searchLower)
    );
  }

  return {
    data: clientes,
    total: clientes.length,
    page: 1,
    totalPages: 1,
  };
};

export const getClienteById = async (id) => {
  await randomDelay();
  simulateError();

  const clientes = loadClientes();
  const cliente = clientes.find((c) => c.id === id);

  if (!cliente) {
    throw new Error(`Cliente con ID ${id} no encontrado`);
  }

  return { data: cliente };
};

export const createCliente = async (clienteData) => {
  await randomDelay();
  simulateError();

  validateCliente(clienteData);

  if (checkDuplicateEmail(clienteData.email)) {
    throw new Error("Ya existe un cliente con ese email");
  }

  const nuevoCliente = {
    id: generateId(),
    ...clienteData,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
  };

  const clientes = loadClientes();
  clientes.push(nuevoCliente);
  saveClientes(clientes);

  return { data: nuevoCliente };
};

export const updateCliente = async (id, updateData) => {
  await randomDelay();
  simulateError();

  // Validar datos si se están actualizando campos críticos
  if (updateData.email || updateData.nombre || updateData.telefono) {
    validateCliente({
      nombre: updateData.nombre || "",
      email: updateData.email || "",
      telefono: updateData.telefono || "",
    });
  }

  if (updateData.email && checkDuplicateEmail(updateData.email, id)) {
    throw new Error("Ya existe otro cliente con ese email");
  }

  const clientes = loadClientes();
  const clienteIndex = clientes.findIndex((c) => c.id === id);

  if (clienteIndex === -1) {
    throw new Error(`Cliente con ID ${id} no encontrado`);
  }

  const clienteActualizado = {
    ...clientes[clienteIndex],
    ...updateData,
    fechaActualizacion: new Date().toISOString(),
  };

  clientes[clienteIndex] = clienteActualizado;
  saveClientes(clientes);

  return { data: clienteActualizado };
};

export const deleteCliente = async (id) => {
  await randomDelay();
  simulateError();

  const clientes = loadClientes();
  const clienteIndex = clientes.findIndex((c) => c.id === id);

  if (clienteIndex === -1) {
    throw new Error(`Cliente con ID ${id} no encontrado`);
  }

  const deletedCliente = clientes.splice(clienteIndex, 1)[0];
  saveClientes(clientes);

  return {
    data: {
      success: true,
      deletedCliente,
    },
  };
};

// ✅ Para compatibilidad con tu código existente
export const getCliente = async () => {
  const result = await getClientes();
  return result.data;
};

export const postCliente = async (data) => {
  const result = await createCliente(data);
  return result;
};

export const putCliente = async (id, data) => {
  const result = await updateCliente(id, data);
  return result;
};
