# Arquitectura del Frontend - Transprint

## 📋 Visión General

Este proyecto utiliza una arquitectura de capas bien definida que separa las responsabilidades y facilita el mantenimiento y escalabilidad del código.

```
┌─────────────────────────────────────────────────────────┐
│                    COMPONENTES UI                        │
│  (Pages, Forms, Tables, Dialogs, Buttons, etc.)         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   CUSTOM HOOKS                           │
│      (useUsuario, useCliente, useVehiculo, etc.)        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              SERVICIOS ESPECÍFICOS                       │
│   (usuarioService, clienteService, viajeService, etc.)  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                SERVICIO GENÉRICO                         │
│  (genericService - getGeneric, postGeneric, etc.)       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    AXIOS / API                           │
│              (Comunicación HTTP con Backend)             │
└─────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Datos

### 1️⃣ Flujo de Lectura (GET)
```
Usuario hace clic en la página
    ↓
Componente UI se monta (useEffect)
    ↓
Custom Hook ejecuta fetchData()
    ↓
Servicio específico llama a getGeneric()
    ↓
genericService ejecuta axios.get()
    ↓
Backend responde con datos
    ↓
Hook actualiza el estado (setData)
    ↓
Componente se re-renderiza con los datos
```

### 2️⃣ Flujo de Escritura (POST/PUT/DELETE)
```
Usuario llena formulario y envía
    ↓
Componente UI ejecuta handleSubmit()
    ↓
Custom Hook ejecuta handleCreate/Update/Delete()
    ↓
Servicio específico llama a postGeneric/putGeneric/deleteGeneric()
    ↓
genericService ejecuta axios.post/put/delete()
    ↓
Backend procesa y responde
    ↓
Hook actualiza el estado local
    ↓
Hook recarga los datos (refetch) para sincronizar
    ↓
Componente muestra los datos actualizados
```

## 📦 Capas del Sistema

### **Capa 1: Servicio Genérico** (`src/services/genericService.js`)
- **Responsabilidad**: Manejar todas las llamadas HTTP básicas
- **Características**:
  - Configuración centralizada de Axios
  - Métodos CRUD genéricos
  - Manejo de headers y parámetros
  - Base URL configurada

### **Capa 2: Servicios Específicos** (`src/services/*Service.js`)
- **Responsabilidad**: Definir endpoints específicos para cada entidad
- **Características**:
  - Usa el servicio genérico
  - Define rutas de API específicas
  - Puede agregar lógica de transformación de datos
  - Encapsula la lógica de negocio de la entidad

### **Capa 3: Custom Hooks** (`src/hooks/entities/*.js`)
- **Responsabilidad**: Gestionar el estado y la lógica de negocio del frontend
- **Características**:
  - Manejo de estados (loading, error, data)
  - Lógica de normalización de datos
  - Funciones para CRUD
  - Gestión de estados de carga independientes
  - Caché local de datos

### **Capa 4: Componentes UI** (`src/pages/*`)
- **Responsabilidad**: Renderizar la interfaz y manejar interacciones del usuario
- **Características**:
  - Presentación visual
  - Manejo de eventos de usuario
  - Composición de componentes
  - Diálogos y formularios

## 🎯 Ventajas de esta Arquitectura

### ✅ **Separación de Responsabilidades**
- Cada capa tiene una función específica y clara
- Facilita el testing unitario
- Reduce el acoplamiento

### ✅ **Reutilización de Código**
- `genericService` se reutiliza en todos los servicios
- Los hooks encapsulan lógica que puede ser reutilizada
- Componentes modulares y composables

### ✅ **Mantenibilidad**
- Cambios en la API solo afectan a servicios específicos
- Cambios en UI no afectan la lógica de negocio
- Fácil de entender y modificar

### ✅ **Escalabilidad**
- Fácil agregar nuevas entidades
- Patrón consistente en todo el proyecto
- Estructura predecible

### ✅ **Testing**
- Cada capa puede ser testeada independientemente
- Fácil crear mocks de servicios
- Hooks pueden ser testeados con React Testing Library

## 📚 Documentación Relacionada

- [Servicios](./SERVICES.md) - Detalles sobre genericService y servicios específicos
- [Hooks](./HOOKS.md) - Cómo funcionan los custom hooks de entidades
- [Componentes de Página](./PAGES.md) - Estructura y funcionamiento de las páginas
- [TanStack Table](./TANSTACK_TABLE.md) - Implementación de tablas con TanStack Table

## 🚀 Ejemplo Completo: Crear un Usuario

```javascript
// 1. Usuario llena el formulario en UsuarioForm.jsx
<UsuarioForm onSubmit={handleCreateSubmit} />

// 2. El componente Usuario.jsx maneja el submit
const handleCreateSubmit = async (data) => {
  const result = await handleCreate(data);
  if (result.success) {
    setIsCreateDialogOpen(false);
  }
};

// 3. El hook useUsuario.js ejecuta la creación
const handleCreate = async (data) => {
  await postUsuario(data);
  await fetchUsuarios(); // Recarga la lista
  return { success: true };
};

// 4. El servicio usuarioService.js llama al endpoint
export const postUsuario = async (data) => {
  return await postGeneric("/register", data);
};

// 5. genericService.js ejecuta la petición HTTP
export const postGeneric = async (endpoint, data) => {
  const response = await api.post(endpoint, data);
  return response.data;
};

// 6. Los datos se actualizan y la tabla se re-renderiza
```
