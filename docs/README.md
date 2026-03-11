# 📚 Documentación del Frontend - Transprint

Bienvenido a la documentación completa del frontend de Transprint. Esta guía te ayudará a entender la arquitectura, patrones y mejores prácticas del proyecto.

---

## 🗂️ Índice de Documentación

### 📖 Guías Principales

1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitectura General
   - Visión general del sistema
   - Flujo de datos
   - Capas del sistema
   - Ventajas de la arquitectura

2. **[SERVICES.md](./SERVICES.md)** - Servicios y API
   - Servicio genérico (`genericService.js`)
   - Servicios específicos por entidad
   - Cómo crear nuevos servicios
   - Mejores prácticas

3. **[HOOKS.md](./HOOKS.md)** - Custom Hooks
   - ¿Qué son los custom hooks?
   - Estructura de `useUsuario`
   - Normalización de datos
   - Manejo de estados de carga
   - Patrones de uso

4. **[PAGES.md](./PAGES.md)** - Componentes de Página
   - Estructura de una página
   - `Usuario.jsx` - Orquestador
   - `UsuarioForm.jsx` - Formularios
   - `UsuarioTable.jsx` - Tablas
   - `UsuarioTableColumns.jsx` - Columnas
   - Flujo completo de acciones

5. **[TANSTACK_TABLE.md](./TANSTACK_TABLE.md)** - TanStack Table
   - Conceptos clave
   - Implementación
   - Features (ordenamiento, filtros, paginación)
   - Ejemplos avanzados

---

## 🚀 Inicio Rápido

### Para Desarrolladores Nuevos

Si eres nuevo en el proyecto, lee los documentos en este orden:

```
1. ARCHITECTURE.md     → Entiende la visión general
2. SERVICES.md         → Aprende cómo se comunica con el backend
3. HOOKS.md            → Entiende la gestión de estado
4. PAGES.md            → Ve cómo se ensambla todo en la UI
5. TANSTACK_TABLE.md   → Profundiza en las tablas
```

### Para Crear una Nueva Entidad

Sigue estos pasos:

1. **Crear el Servicio** (ver [SERVICES.md](./SERVICES.md))
   ```bash
   src/services/miEntidadService.js
   ```

2. **Crear el Hook** (ver [HOOKS.md](./HOOKS.md))
   ```bash
   src/hooks/entities/useMiEntidad.js
   ```

3. **Crear los Componentes de Página** (ver [PAGES.md](./PAGES.md))
   ```bash
   src/pages/MiEntidad/
   ├── MiEntidad.jsx
   ├── MiEntidadForm.jsx
   ├── MiEntidadTable.jsx
   └── MiEntidadTableColumns.jsx
   ```

4. **Agregar la Ruta**
   ```javascript
   // src/routes/AppRoutes.jsx
   <Route path="/mi-entidad" element={<MiEntidad />} />
   ```

---

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── Header/
│   ├── Sidebar/
│   └── Footer/
│
├── pages/              # Páginas de la aplicación
│   ├── Usuario/
│   ├── Cliente/
│   ├── Vehiculo/
│   └── ...
│
├── hooks/              # Custom hooks
│   └── entities/       # Hooks por entidad
│
├── services/           # Servicios de API
│   ├── genericService.js
│   ├── usuarioService.js
│   └── ...
│
├── routes/             # Configuración de rutas
├── context/            # Context API
├── utils/              # Utilidades
└── configuration/      # Configuración
```

---

## 🔄 Flujo de Datos Resumido

```
┌─────────────┐
│   Usuario   │ Interactúa con la UI
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Componente │ Usuario.jsx, UsuarioForm.jsx, etc.
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Custom Hook │ useUsuario
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Servicio   │ usuarioService
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  genérico   │ genericService
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Backend   │ API REST
└─────────────┘
```

---

## 🛠️ Tecnologías Principales

| Tecnología | Propósito | Documentación |
|------------|-----------|---------------|
| **React** | Framework principal | [React Docs](https://react.dev/) |
| **TanStack Table** | Tablas avanzadas | [TANSTACK_TABLE.md](./TANSTACK_TABLE.md) |
| **React Hook Form** | Formularios | [React Hook Form](https://react-hook-form.com/) |
| **Axios** | Cliente HTTP | [SERVICES.md](./SERVICES.md) |
| **Shadcn UI** | Componentes UI | [Shadcn](https://ui.shadcn.com/) |
| **Tailwind CSS** | Estilos | [Tailwind](https://tailwindcss.com/) |

---

## 🎯 Patrones de Diseño Utilizados

### 1. **Repository Pattern**
- Los servicios actúan como repositorios
- Abstraen la capa de datos del resto de la aplicación

### 2. **Custom Hooks Pattern**
- Encapsulan lógica de negocio reutilizable
- Separan la lógica de la presentación

### 3. **Composition Pattern**
- Los componentes se componen de componentes más pequeños
- `Usuario.jsx` compone `UsuarioForm`, `UsuarioTable`, etc.

### 4. **Container/Presentational Pattern**
- Componentes orquestadores (containers): `Usuario.jsx`
- Componentes de presentación: `UsuarioForm.jsx`, `UsuarioTable.jsx`

---

## 📝 Convenciones de Código

### Nombres de Archivos
- **Componentes**: PascalCase → `UsuarioForm.jsx`
- **Hooks**: camelCase con prefijo `use` → `useUsuario.js`
- **Servicios**: camelCase con sufijo `Service` → `usuarioService.js`
- **Utilidades**: camelCase → `getHeaders.js`

### Nombres de Funciones
- **Handlers**: Prefijo `handle` → `handleCreate`, `handleEdit`
- **Fetch**: Prefijo `fetch` → `fetchUsuarios`
- **Get**: Prefijo `get` → `getUsuario`

### Exportaciones
- **Named exports** para servicios y utilidades
- **Default exports** para componentes de página

---

## 🧪 Testing (Futuro)

### Estructura de Tests
```
src/
├── __tests__/
│   ├── services/
│   ├── hooks/
│   └── components/
```

### Herramientas Recomendadas
- **Vitest**: Test runner
- **React Testing Library**: Testing de componentes
- **MSW**: Mock Service Worker para APIs

---

## 🤝 Contribuir

### Antes de Contribuir
1. Lee toda la documentación
2. Entiende el flujo de datos
3. Sigue las convenciones de código

### Proceso de Contribución
1. Crea una rama con nombre descriptivo
2. Implementa siguiendo los patrones existentes
3. Documenta cambios significativos
4. Haz un pull request

---

## 🆘 Soporte

### Preguntas Frecuentes

**P: ¿Cómo agrego una nueva página?**
R: Ver sección "Para Crear una Nueva Entidad" arriba.

**P: ¿Por qué usar TanStack Table?**
R: Ver [TANSTACK_TABLE.md](./TANSTACK_TABLE.md)

**P: ¿Cómo manejo errores de API?**
R: Los hooks manejan errores automáticamente. Ver [HOOKS.md](./HOOKS.md)

**P: ¿Necesito Redux?**
R: No para este proyecto. Los custom hooks manejan el estado eficientemente.

---

## 📚 Recursos Adicionales

- [React Docs](https://react.dev/)
- [TanStack Table](https://tanstack.com/table/v8)
- [React Hook Form](https://react-hook-form.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📄 Licencia

[Especificar licencia del proyecto]

---

**Última actualización**: Enero 2026
