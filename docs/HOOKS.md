# Custom Hooks - Gestión de Estado y Lógica de Negocio

## 📋 Índice
- [¿Qué es un Custom Hook?](#qué-es-un-custom-hook)
- [Estructura de un Hook de Entidad](#estructura-de-un-hook-de-entidad)
- [Análisis Detallado: useUsuario](#análisis-detallado-useusuario)
- [Patrón de Uso](#patrón-de-uso)

---

## 🎯 ¿Qué es un Custom Hook?

### Definición
Un **Custom Hook** es una función de JavaScript que usa hooks de React (como `useState`, `useEffect`, `useCallback`) para encapsular lógica reutilizable relacionada con el estado y efectos.

### Propósito en este Proyecto
Los hooks de entidades (`useUsuario`, `useCliente`, `useVehiculo`, etc.) encapsulan:
- ✅ Estado de los datos (lista de elementos)
- ✅ Estados de carga (loading, loadingCreate, loadingUpdate, loadingDelete)
- ✅ Manejo de errores
- ✅ Funciones CRUD (Create, Read, Update, Delete)
- ✅ Normalización y transformación de datos
- ✅ Sincronización con el backend

---

## 🏗️ Estructura de un Hook de Entidad

### Ubicación
`src/hooks/entities/*.js`

### Anatomía Básica

```javascript
export const useEntidad = () => {
  // 1. Estados
  const [entidades, setEntidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // 2. Funciones de lectura
  const fetchEntidades = useCallback(async () => { ... }, []);

  // 3. useEffect para carga inicial
  useEffect(() => {
    fetchEntidades();
  }, [fetchEntidades]);

  // 4. Funciones de escritura
  const handleCreate = async (data) => { ... };
  const handleUpdate = async (id, data) => { ... };
  const handleDelete = async (id) => { ... };

  // 5. Retorno de API pública
  return {
    entidades,
    loading,
    error,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch: fetchEntidades,
  };
};
```

---

## 🔍 Análisis Detallado: `useUsuario`

### 1️⃣ Estados del Hook

```javascript
const [usuarios, setUsuarios] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [loadingCreate, setLoadingCreate] = useState(false);
const [loadingUpdate, setLoadingUpdate] = useState(false);
const [loadingDelete, setLoadingDelete] = useState(false);
```

#### **¿Por qué múltiples estados de loading?**
- `loading`: Carga inicial de datos
- `loadingCreate`: Mientras se crea un usuario (para deshabilitar botón de crear)
- `loadingUpdate`: Mientras se actualiza (para deshabilitar botón de guardar)
- `loadingDelete`: Mientras se elimina (para mostrar spinner en diálogo)

**Ventaja**: Cada acción tiene su propio estado, permitiendo UX más granular.

---

### 2️⃣ Normalización de Datos

```javascript
const normalizeUser = (user) => {
  if (!user) return user;
  const roleFromArray = Array.isArray(user.roles) ? user.roles[0] : undefined;

  return {
    ...user,
    user_id: user.user_id ?? user.id,
    role: user.role ?? roleFromArray ?? "",
  };
};
```

#### **¿Para qué sirve?**
- El backend puede devolver datos en diferentes formatos
- Unifica la estructura para que el frontend siempre trabaje con el mismo formato
- Ejemplo: `user.roles` puede ser array o string → siempre convierte a string

```javascript
// Backend puede devolver:
{ id: "123", roles: ["Admin"] }
{ user_id: "123", role: "Admin" }

// normalizeUser garantiza:
{ user_id: "123", role: "Admin", ... }
```

---

### 3️⃣ Extracción Flexible de Datos

```javascript
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
```

#### **¿Por qué es necesario?**
El backend puede devolver datos en diferentes estructuras:

```javascript
// Caso 1: Array directo
[{ id: 1 }, { id: 2 }]

// Caso 2: Dentro de .data
{ data: [{ id: 1 }, { id: 2 }] }

// Caso 3: Anidado más profundo
{ data: { data: [{ id: 1 }, { id: 2 }] } }
```

`extractUsers` maneja todos estos casos y normaliza cada usuario.

---

### 4️⃣ Función de Lectura (Fetch)

```javascript
const fetchUsuarios = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await getUsuario();
    setUsuarios(extractUsers(response));
  } catch (err) {
    setError(err.message || "Error desconocido");
    console.error("Error al cargar usuarios:", err);
  } finally {
    setLoading(false);
  }
}, []);
```

#### **useCallback - ¿Por qué?**
```javascript
const fetchUsuarios = useCallback(async () => { ... }, []);
```
- **Memoiza** la función para que no se recree en cada render
- Evita renders infinitos cuando se usa en `useEffect`
- Dependencias vacías `[]` porque no depende de props o estado

#### **Patrón de Manejo de Errores**
1. `setLoading(true)` → Muestra spinner
2. `setError(null)` → Limpia error anterior
3. `try/catch` → Captura errores
4. `finally` → Siempre ejecuta `setLoading(false)`

---

### 5️⃣ Carga Inicial

```javascript
useEffect(() => {
  fetchUsuarios();
}, [fetchUsuarios]);
```

#### **¿Cuándo se ejecuta?**
- Al montar el componente (primera vez)
- Si `fetchUsuarios` cambia (nunca, porque está memoizada)

**Resultado**: Los datos se cargan automáticamente al abrir la página.

---

### 6️⃣ Función de Creación

```javascript
const handleCreate = async (data) => {
  setLoadingCreate(true);
  setError(null);

  try {
    console.log("Creating user with data:", data);

    await postUsuario(data); // Llama al servicio
    await fetchUsuarios(); // Recarga la lista completa

    return { success: true };
  } catch (err) {
    const errorMsg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err.message ||
      "Error desconocido";

    setError(errorMsg);
    console.error("Error al crear usuario:", err);

    return { success: false, error: errorMsg };
  } finally {
    setLoadingCreate(false);
  }
};
```

#### **Flujo Completo**
```
1. Usuario llena formulario
2. setLoadingCreate(true) → Botón se deshabilita
3. await postUsuario(data) → Crea en backend
4. await fetchUsuarios() → Recarga lista actualizada
5. return { success: true } → Componente cierra el diálogo
6. setLoadingCreate(false) → Botón se habilita de nuevo
```

#### **¿Por qué `fetchUsuarios()` después de crear?**
- Garantiza sincronización con el backend
- El backend puede agregar campos automáticos (createdAt, id, etc.)
- La lista se actualiza con datos reales, no optimistas

#### **Manejo de Errores Robusto**
```javascript
const errorMsg =
  err?.response?.data?.message ||  // Error de Axios
  err?.response?.data?.error ||    // Formato alternativo
  err.message ||                   // Error de JavaScript
  "Error desconocido";             // Fallback
```

---

### 7️⃣ Función de Actualización

```javascript
const handleUpdate = async (id, data, selectedUsuario) => {
  setLoadingUpdate(true);
  setError(null);

  try {
    const payload = {};

    // Solo envía campos modificados
    Object.keys(data).forEach((key) => {
      const newValue = data[key];
      const oldValue = selectedUsuario[key];

      if (newValue === "" || newValue == null) return;
      if (newValue === oldValue) return;

      payload[key] = newValue;
    });

    // No envía password vacío
    if (!data.password || data.password.trim() === "") {
      delete payload.password;
    }

    console.log("Updating user ID:", id);
    console.log("Final payload:", payload);

    await putUsuario(id, payload);
    await fetchUsuarios(); // Recarga lista

    return { success: true };
  } catch (err) {
    const errorMsg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err.message ||
      "Error desconocido";

    setError(errorMsg);
    console.error("Error al actualizar usuario:", err);

    return { success: false, error: errorMsg };
  } finally {
    setLoadingUpdate(false);
  }
};
```

#### **Optimización: Solo Campos Modificados**
```javascript
Object.keys(data).forEach((key) => {
  const newValue = data[key];
  const oldValue = selectedUsuario[key];

  if (newValue === "" || newValue == null) return; // Ignora vacíos
  if (newValue === oldValue) return; // Ignora sin cambios

  payload[key] = newValue; // Solo agrega modificados
});
```

**Ventaja**:
- Reduce el tamaño del payload
- Evita sobrescribir campos innecesariamente
- Backend solo procesa lo que cambió

#### **Caso Especial: Password**
```javascript
if (!data.password || data.password.trim() === "") {
  delete payload.password;
}
```
- En edición, el password es opcional
- Si está vacío, no se envía al backend
- Permite editar sin cambiar la contraseña

---

### 8️⃣ Función de Eliminación

```javascript
const handleDelete = async (id) => {
  setLoadingDelete(true);
  setError(null);
  try {
    console.log("Deleting user ID:", id);
    await deleteUsuario(id);
    
    // Actualización optimista del estado local
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
    return { success: false, error: errorMsg };
  } finally {
    setLoadingDelete(false);
  }
};
```

#### **Actualización Optimista**
```javascript
setUsuarios((prev) => prev.filter((u) => u.user_id !== id));
```
- No hace `fetchUsuarios()` (a diferencia de create/update)
- Actualiza el estado local inmediatamente
- La UI responde más rápido
- Si falla, el error se maneja y se puede revertir

---

### 9️⃣ API Pública del Hook

```javascript
return {
  usuarios,           // Lista de usuarios
  loading,            // Carga inicial
  error,              // Error global
  loadingCreate,      // Cargando creación
  loadingUpdate,      // Cargando actualización
  loadingDelete,      // Cargando eliminación
  handleCreate,       // Función para crear
  handleUpdate,       // Función para actualizar
  handleDelete,       // Función para eliminar
  refetch: fetchUsuarios, // Función para recargar
};
```

#### **Uso en Componente**
```javascript
const {
  usuarios,
  loading,
  handleCreate,
  handleUpdate,
  handleDelete,
} = useUsuario();
```

---

## 🎯 Patrón de Uso

### En el Componente de Página

```javascript
// Usuario.jsx
import { useUsuario } from '../../hooks/entities/useUsuario';

export const Usuario = () => {
  const {
    usuarios,
    loading,
    error,
    loadingCreate,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch,
  } = useUsuario();

  // Ahora tienes acceso a todo lo que necesitas
  return (
    <div>
      {loading && <Spinner />}
      {error && <Alert>{error}</Alert>}
      <UsuarioTable data={usuarios} />
      <UsuarioForm onSubmit={handleCreate} isLoading={loadingCreate} />
    </div>
  );
};
```

---

## ✅ Ventajas de este Patrón

### 1️⃣ **Separación de Responsabilidades**
- Componentes UI → Presentación
- Hooks → Lógica de negocio y estado
- Servicios → Comunicación con API

### 2️⃣ **Reutilización**
```javascript
// Puedes usar el mismo hook en múltiples componentes
function UsuarioList() {
  const { usuarios, loading } = useUsuario();
  // ...
}

function UsuarioSelector() {
  const { usuarios } = useUsuario();
  // ...
}
```

### 3️⃣ **Testing Fácil**
```javascript
// Test del hook
const { result } = renderHook(() => useUsuario());
await waitFor(() => expect(result.current.usuarios).toHaveLength(5));
```

### 4️⃣ **Estado Centralizado**
- Un solo punto de verdad para los datos de usuarios
- No necesitas Redux para este caso de uso
- React hooks son suficientes

---

## 🔗 Referencias

- [Servicios](./SERVICES.md)
- [Componentes de Página](./PAGES.md)
- [React Hooks Docs](https://react.dev/reference/react)
