# Servicios - Capa de Comunicación con API

## 📋 Índice
- [Servicio Genérico](#servicio-genérico)
- [Servicios Específicos](#servicios-específicos)
- [Cómo Crear un Nuevo Servicio](#cómo-crear-un-nuevo-servicio)

---

## 🔧 Servicio Genérico

### Ubicación
`src/services/genericService.js`

### Propósito
Proporcionar métodos genéricos para todas las operaciones HTTP (GET, POST, PUT, DELETE) que son reutilizados por todos los servicios específicos.

### Código Completo

```javascript
import axios from "axios";
import { backend_url } from "../configuration/app.config";

// Instancia de Axios configurada
const api = axios.create({
  baseURL: `${backend_url}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// GET (listado o con filtros)
export const getGeneric = async (endpoint, params = {}, headers = {}) => {
  if (!endpoint) throw new Error("Endpoint no definido");
  const response = await api.get(endpoint, { params, headers });
  return response.data;
};

// GET por ID
export const getByIdGeneric = async (endpoint, id, headers = {}, params = {}) => {
  if (!endpoint || !id) throw new Error("Endpoint o ID no definido");
  const response = await api.get(`${endpoint}/${id}`, { headers, params });
  return response.data;
};

// POST
export const postGeneric = async (endpoint, data, headers = {}, params = {}) => {
  if (!endpoint) throw new Error("Endpoint no definido");
  const response = await api.post(endpoint, data, { headers, params });
  return response.data;
};

// PUT
export const putGeneric = async (endpoint, data, headers = {}, params = {}) => {
  if (!endpoint) throw new Error("Endpoint no definido");
  const response = await api.put(endpoint, data, { headers, params });
  return response.data;
};

// DELETE
export const deleteGeneric = async (endpoint, headers = {}, params = {}) => {
  if (!endpoint) throw new Error("Endpoint no definido");
  const response = await api.delete(endpoint, { headers, params });
  return response.data;
};
```

### Características Clave

#### ✅ **Instancia de Axios Centralizada**
```javascript
const api = axios.create({
  baseURL: `${backend_url}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});
```
- **baseURL**: Se configura una vez y todas las peticiones la usan
- **headers**: Headers por defecto para todas las peticiones
- **Ventaja**: Si necesitas agregar interceptors o cambiar configuración, lo haces en un solo lugar

#### ✅ **Parámetros Opcionales con Valores por Defecto**
```javascript
async (endpoint, params = {}, headers = {})
```
- `params` y `headers` son opcionales
- Si no se pasan, se usan objetos vacíos
- Permite flexibilidad sin complejidad

#### ✅ **Validación de Parámetros Requeridos**
```javascript
if (!endpoint) throw new Error("Endpoint no definido");
```
- Valida que los parámetros críticos estén presentes
- Lanza errores descriptivos que facilitan el debugging

#### ✅ **Retorno Consistente**
```javascript
return response.data;
```
- Siempre devuelve solo la propiedad `data` de Axios
- Los servicios específicos no necesitan extraer `response.data`

---

## 🎯 Servicios Específicos

### Ubicación
`src/services/*Service.js`

### Propósito
Definir las rutas de API específicas para cada entidad del sistema (Usuario, Cliente, Vehículo, etc.)

### Ejemplo: `usuarioService.js`

```javascript
import {
  getGeneric,
  postGeneric,
  putGeneric,
  deleteGeneric,
} from "./genericService";

// Obtener todos los usuarios
export const getUsuario = async () => {
  return await getGeneric("/usuarios");
};

// Registrar nuevo usuario
export const postUsuario = async (data) => {
  return await postGeneric("/register", data);
};

// Actualizar usuario
export const putUsuario = async (id, data) => {
  const encodedId = encodeURIComponent(id);
  return await putGeneric(`/usuarios/${encodedId}`, data);
};

// Eliminar usuario
export const deleteUsuario = async (id) => {
  const encodedId = encodeURIComponent(id);
  return await deleteGeneric(`/usuarios/${encodedId}`);
};
```

### Características de los Servicios Específicos

#### ✅ **Endpoints Explícitos**
```javascript
return await getGeneric("/usuarios");
```
- Cada función define claramente su endpoint
- Fácil de entender qué ruta de API se está usando

#### ✅ **Lógica Específica de la Entidad**
```javascript
const encodedId = encodeURIComponent(id);
return await putGeneric(`/usuarios/${encodedId}`, data);
```
- Puede incluir transformaciones específicas
- En este caso, codifica el ID para manejar caracteres especiales
- Cada servicio puede tener su propia lógica

#### ✅ **Nombres Semánticos**
```javascript
export const postUsuario = async (data) => {
  return await postGeneric("/register", data);
};
```
- El nombre de la función es semántico (`postUsuario`)
- El endpoint puede ser diferente (`/register`)
- Abstrae los detalles de implementación del backend

---

## 🆕 Cómo Crear un Nuevo Servicio

### Paso 1: Crear el archivo del servicio

```javascript
// src/services/productoService.js
import {
  getGeneric,
  postGeneric,
  putGeneric,
  deleteGeneric,
} from "./genericService";

// Obtener todos los productos
export const getProducto = async () => {
  return await getGeneric("/productos");
};

// Obtener productos con filtros (opcional)
export const getProductos = async (params = {}) => {
  return await getGeneric("/productos", params);
};

// Crear producto
export const postProducto = async (data) => {
  return await postGeneric("/productos", data);
};

// Actualizar producto
export const putProducto = async (id, data) => {
  return await putGeneric(`/productos/${id}`, data);
};

// Eliminar producto
export const deleteProducto = async (id) => {
  return await deleteGeneric(`/productos/${id}`);
};
```

### Paso 2: Casos Especiales

#### Con parámetros de búsqueda
```javascript
export const getProductosPorCategoria = async (categoria) => {
  return await getGeneric("/productos", { categoria });
};
```

#### Con headers personalizados (si fuera necesario)
```javascript
export const uploadProductoImagen = async (id, formData) => {
  const headers = { "Content-Type": "multipart/form-data" };
  return await postGeneric(`/productos/${id}/imagen`, formData, headers);
};
```

#### Con validación personalizada
```javascript
export const putProducto = async (id, data) => {
  if (!id || !data) {
    throw new Error("ID y datos son requeridos");
  }
  
  // Validar que el precio sea positivo
  if (data.precio && data.precio < 0) {
    throw new Error("El precio debe ser positivo");
  }
  
  return await putGeneric(`/productos/${id}`, data);
};
```

---

## 🔍 Comparación: Con y Sin Servicio Genérico

### ❌ Sin Servicio Genérico (Repetitivo)
```javascript
// usuarioService.js
export const getUsuario = async () => {
  const response = await axios.get(`${backend_url}/api/usuarios`);
  return response.data;
};

export const postUsuario = async (data) => {
  const response = await axios.post(`${backend_url}/api/register`, data);
  return response.data;
};

// clienteService.js
export const getCliente = async () => {
  const response = await axios.get(`${backend_url}/api/cliente`);
  return response.data;
};

export const postCliente = async (data) => {
  const response = await axios.post(`${backend_url}/api/cliente`, data);
  return response.data;
};

// ❌ Mucho código duplicado
// ❌ Difícil de mantener
// ❌ Si cambia la configuración, hay que modificar todos los servicios
```

### ✅ Con Servicio Genérico (DRY)
```javascript
// usuarioService.js
export const getUsuario = async () => {
  return await getGeneric("/usuarios");
};

export const postUsuario = async (data) => {
  return await postGeneric("/register", data);
};

// clienteService.js
export const getCliente = async () => {
  return await getGeneric("/cliente");
};

export const postCliente = async (data) => {
  return await postGeneric("/cliente", data);
};

// ✅ Código limpio y conciso
// ✅ Fácil de mantener
// ✅ Un solo lugar para cambiar configuración
```

---

## 🎓 Mejores Prácticas

### ✅ **DO - Hacer**
- ✅ Usar el servicio genérico para todas las operaciones CRUD estándar
- ✅ Mantener los servicios específicos enfocados en su entidad
- ✅ Usar nombres descriptivos que reflejen la acción
- ✅ Validar datos antes de enviar al backend (cuando tenga sentido)
- ✅ Codificar URLs cuando sea necesario (`encodeURIComponent`)

### ❌ **DON'T - No Hacer**
- ❌ Duplicar la lógica de peticiones HTTP
- ❌ Mezclar lógica de UI con lógica de servicios
- ❌ Incluir estados de React en los servicios
- ❌ Hacer peticiones HTTP directamente desde componentes
- ❌ Hardcodear URLs completas (usa rutas relativas)

---

## 🔗 Referencias

- [Documentación de Axios](https://axios-http.com/)
- [Hooks - useUsuario](./HOOKS.md)
- [Arquitectura General](./ARCHITECTURE.md)
