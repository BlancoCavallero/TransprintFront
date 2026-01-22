# Componentes de Página - Estructura y Funcionamiento

## 📋 Índice
- [Arquitectura de una Página](#arquitectura-de-una-página)
- [Usuario.jsx - Componente Orquestador](#usuariojsx---componente-orquestador)
- [UsuarioForm.jsx - Formulario](#usuarioformjsx---formulario)
- [UsuarioTable.jsx - Tabla](#usuariotablejsx---tabla)
- [UsuarioTableColumns.jsx - Definición de Columnas](#usuariotablecolumnsjsx---definición-de-columnas)
- [Flujo Completo de una Acción](#flujo-completo-de-una-acción)

---

## 🏗️ Arquitectura de una Página

Cada entidad (Usuario, Cliente, Vehículo, etc.) sigue el mismo patrón de 4 componentes:

```
pages/Usuario/
├── Usuario.jsx              # Orquestador principal
├── UsuarioForm.jsx          # Formulario de crear/editar
├── UsuarioTable.jsx         # Tabla con filtros y paginación
└── UsuarioTableColumns.jsx  # Definición de columnas
```

### Responsabilidades

| Componente | Responsabilidad |
|------------|----------------|
| `Usuario.jsx` | Coordina todos los componentes, maneja el estado de diálogos y ejecuta acciones |
| `UsuarioForm.jsx` | Renderiza el formulario y valida los datos |
| `UsuarioTable.jsx` | Muestra la tabla con paginación, filtros y ordenamiento |
| `UsuarioTableColumns.jsx` | Define la estructura de las columnas de la tabla |

---

## 🎯 `Usuario.jsx` - Componente Orquestador

### Propósito
Es el **controlador central** que coordina toda la lógica de la página de usuarios.

### Código Completo (Simplificado)

```javascript
import { useState } from 'react';
import { useUsuario } from '../../hooks/entities/useUsuario';
import { UsuarioTable } from './UsuarioTable';
import { UsuarioForm } from './UsuarioForm';
import { createUsuarioColumns } from './UsuarioTableColumns';
import { DeleteConfirmationDialog } from '@/components/Alert/DeleteConfirmationDialog';

export const Usuario = () => {
  // 1. Hook personalizado (estado y lógica)
  const {
    usuarios,
    loading,
    error,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch,
  } = useUsuario();

  // 2. Estados locales para UI
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  // 3. Handlers para acciones de la tabla
  const handleEditClick = (item) => {
    setSelectedUsuario({ ...item });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedUsuario(item);
    setIsDeleteDialogOpen(true);
  };

  // 4. Handlers para submits de formularios
  const handleCreateSubmit = async (data) => {
    const result = await handleCreate(data);
    if (result.success) {
      setIsCreateDialogOpen(false);
    }
    return result;
  };

  const handleUpdateSubmit = async (data) => {
    if (!selectedUsuario) return;
    const result = await handleUpdate(selectedUsuario.user_id, data, selectedUsuario);
    if (result.success) {
      setIsEditDialogOpen(false);
      setSelectedUsuario(null);
    }
    return result;
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUsuario) return;
    const result = await handleDelete(selectedUsuario.user_id);
    if (result.success) {
      setIsDeleteDialogOpen(false);
      setSelectedUsuario(null);
    }
  };

  // 5. Definición de columnas
  const columns = createUsuarioColumns(handleEditClick, handleDeleteClick);

  // 6. Renderizado
  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      {/* Header con botones */}
      <div className="flex justify-between mb-6">
        <h1>Usuarios</h1>
        <div>
          <Button onClick={refetch}>Actualizar</Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {/* Alerta de error */}
      {error && <Alert variant="destructive">{error}</Alert>}

      {/* Tabla */}
      <UsuarioTable columns={columns} data={usuarios} />

      {/* Diálogo de Creación */}
      <UsuarioForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateSubmit}
        isLoading={loadingCreate}
        mode="create"
      />

      {/* Diálogo de Edición */}
      <UsuarioForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateSubmit}
        defaultValues={selectedUsuario}
        isLoading={loadingUpdate}
        mode="edit"
      />

      {/* Diálogo de Confirmación de Eliminación */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={loadingDelete}
        description={`¿Eliminar a ${selectedUsuario?.nombre_completo}?`}
      />
    </div>
  );
};
```

### Análisis por Secciones

#### 1️⃣ **Hook Personalizado**
```javascript
const {
  usuarios,
  loading,
  error,
  handleCreate,
  handleUpdate,
  handleDelete,
  refetch,
} = useUsuario();
```
- Consume el hook `useUsuario`
- Obtiene datos, estados de carga y funciones CRUD
- **No maneja lógica de negocio** → Eso lo hace el hook

#### 2️⃣ **Estados Locales para UI**
```javascript
const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
const [selectedUsuario, setSelectedUsuario] = useState(null);
```
- Estados para **controlar diálogos**
- `selectedUsuario`: Guarda el usuario que se está editando/eliminando
- **UI State vs Business Logic State**:
  - UI State → En el componente
  - Business Logic → En el hook

#### 3️⃣ **Handlers para Acciones de Tabla**
```javascript
const handleEditClick = (item) => {
  setSelectedUsuario({ ...item }); // Copia el objeto
  setIsEditDialogOpen(true);        // Abre el diálogo
};
```
- Se pasan a las columnas de la tabla
- Cuando el usuario hace clic en "Editar", se ejecutan
- Preparan el estado para el diálogo

**¿Por qué `{ ...item }`?**
```javascript
setSelectedUsuario({ ...item }); // ✅ Crea una copia
setSelectedUsuario(item);         // ❌ Pasa la referencia
```
- Crear una copia evita mutaciones accidentales
- El formulario puede modificar el objeto sin afectar la lista

#### 4️⃣ **Handlers para Submits**
```javascript
const handleCreateSubmit = async (data) => {
  const result = await handleCreate(data); // Llama al hook
  if (result.success) {
    setIsCreateDialogOpen(false); // Cierra el diálogo
  }
  return result; // El formulario puede mostrar errores
};
```

**Flujo**:
1. Formulario valida y envía datos
2. `handleCreateSubmit` llama a `handleCreate` del hook
3. El hook hace la petición al backend
4. Si tiene éxito → cierra el diálogo
5. Si falla → el formulario muestra el error

#### 5️⃣ **Definición de Columnas**
```javascript
const columns = createUsuarioColumns(handleEditClick, handleDeleteClick);
```
- Crea las columnas pasando los handlers
- Las columnas renderizarán botones con estos callbacks

#### 6️⃣ **Renderizado Condicional**
```javascript
if (loading) {
  return <div>Cargando...</div>;
}
```
- Muestra spinner mientras carga
- Evita renderizar la tabla con datos vacíos

---

## 📝 `UsuarioForm.jsx` - Formulario

### Propósito
Renderizar y validar el formulario de creación/edición de usuarios.

### Características Clave

```javascript
export const UsuarioForm = ({
  open,           // Controla si el diálogo está abierto
  onOpenChange,   // Callback para cerrar el diálogo
  onSubmit,       // Función para enviar datos
  defaultValues,  // Valores para edición
  isLoading,      // Estado de carga
  mode,           // 'create' o 'edit'
}) => {
  // 1. React Hook Form
  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      nombre_completo: '',
      role: 'Empleado',
    },
  });

  // 2. Sincronizar valores cuando se abre
  useEffect(() => {
    if (open && defaultValues && mode === 'edit') {
      form.reset({
        username: defaultValues.username || '',
        email: defaultValues.email || '',
        password: '',
        nombre_completo: defaultValues.nombre_completo || '',
        role: defaultValues.role || 'Empleado',
      });
    } else if (open && mode === 'create') {
      form.reset({
        username: '',
        email: '',
        password: '',
        nombre_completo: '',
        role: 'Empleado',
      });
    }
  }, [open, defaultValues, mode, form]);

  // 3. Handler de submit
  const handleSubmit = async (data) => {
    const result = await onSubmit(data);
    if (result?.success) {
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Crear Usuario' : 'Editar Usuario'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {/* Campos del formulario */}
            <FormField
              control={form.control}
              name="nombre_completo"
              rules={{ required: 'El nombre es requerido' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Más campos... */}

            <DialogFooter>
              <Button type="button" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="animate-spin" />}
                {mode === 'create' ? 'Crear' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
```

### Análisis de Características

#### **React Hook Form**
```javascript
const form = useForm({
  defaultValues: { ... }
});
```
- Maneja el estado del formulario
- Validación integrada
- Mejor rendimiento que estado manual

#### **Sincronización con defaultValues**
```javascript
useEffect(() => {
  if (open && defaultValues && mode === 'edit') {
    form.reset({ ...defaultValues });
  }
}, [open, defaultValues, mode]);
```
- Cuando se abre en modo edición, carga los valores
- `form.reset()` actualiza todos los campos
- Solo se ejecuta cuando cambian las dependencias

#### **Validación**
```javascript
<FormField
  rules={{ required: 'El nombre es requerido' }}
  ...
/>
```
- Validaciones declarativas
- Mensajes de error automáticos
- `<FormMessage />` muestra los errores

#### **Modo Dual: Create/Edit**
```javascript
{mode === 'create' ? 'Crear Usuario' : 'Editar Usuario'}
```
- Un solo componente para dos propósitos
- Cambia textos y validaciones según el modo
- Password es opcional en edición

---

## 📊 `UsuarioTable.jsx` - Tabla

### Propósito
Renderizar la tabla de usuarios con filtros, ordenamiento y paginación usando **TanStack Table**.

### Código Simplificado

```javascript
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';

export const UsuarioTable = ({ columns, data }) => {
  // 1. Estados locales para filtros y ordenamiento
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  // 2. Configuración de TanStack Table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row.user_id || row.id,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      {/* Filtro */}
      <Input
        placeholder="Filtrar por nombre..."
        value={table.getColumn('nombre_completo')?.getFilterValue() ?? ''}
        onChange={(e) =>
          table.getColumn('nombre_completo')?.setFilterValue(e.target.value)
        }
      />

      {/* Tabla */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Paginación */}
      <div>
        <Button onClick={() => table.previousPage()}>Anterior</Button>
        <Button onClick={() => table.nextPage()}>Siguiente</Button>
      </div>
    </div>
  );
};
```

### Características de TanStack Table

#### **1. Modularidad**
```javascript
getCoreRowModel: getCoreRowModel(),           // Core: renderizado básico
getPaginationRowModel: getPaginationRowModel(), // Paginación
getSortedRowModel: getSortedRowModel(),       // Ordenamiento
getFilteredRowModel: getFilteredRowModel(),   // Filtros
```
- Cada feature es un plugin separado
- Solo incluyes lo que necesitas

#### **2. Estado Controlado**
```javascript
state: {
  sorting,
  columnFilters,
}
```
- React controla el estado
- Puedes persistir el estado o sincronizarlo con URL

#### **3. Row ID Personalizado**
```javascript
getRowId: (row) => row.user_id || row.id
```
- Define cómo identificar cada fila
- Importante para actualizaciones eficientes

#### **4. Renderizado con `flexRender`**
```javascript
{flexRender(header.column.columnDef.header, header.getContext())}
```
- Renderiza el contenido de la celda
- Puede ser string, componente o función

---

## 🎨 `UsuarioTableColumns.jsx` - Definición de Columnas

### Propósito
Definir la estructura de las columnas de la tabla.

### Código

```javascript
export const createUsuarioColumns = (onEdit, onDelete) => [
  {
    accessorKey: 'nombre_completo',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Nombre
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: 'username',
    header: 'Usuario',
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4" />
        <span>{row.original.email}</span>
      </div>
    ),
  },
  {
    id: 'acciones',
    header: 'Acciones',
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex gap-2">
          <Button onClick={() => onEdit(item)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button onClick={() => onDelete(item)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
```

### Análisis

#### **accessorKey**
```javascript
{ accessorKey: 'nombre_completo' }
```
- Define qué campo del objeto mostrar
- TanStack Table automáticamente extrae `row.nombre_completo`

#### **Header Personalizado**
```javascript
header: ({ column }) => (
  <Button onClick={() => column.toggleSorting()}>
    Nombre <ArrowUpDown />
  </Button>
)
```
- Convierte el header en botón clickeable
- `column.toggleSorting()` cambia el ordenamiento

#### **Cell Personalizado**
```javascript
cell: ({ row }) => (
  <div>
    <Mail /> {row.original.email}
  </div>
)
```
- Personaliza cómo se renderiza la celda
- `row.original` es el objeto completo del usuario

#### **Columna de Acciones**
```javascript
{
  id: 'acciones',
  cell: ({ row }) => (
    <Button onClick={() => onEdit(row.original)}>Editar</Button>
  )
}
```
- `id` en lugar de `accessorKey` (no es un campo de datos)
- Llama a `onEdit` pasando el usuario completo

---

## 🔄 Flujo Completo de una Acción

### Ejemplo: Editar un Usuario

```
┌─────────────────────────────────────────┐
│ 1. Usuario hace clic en botón "Editar" │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 2. UsuarioTableColumns.jsx              │
│    onClick={() => onEdit(item)}         │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 3. Usuario.jsx - handleEditClick        │
│    setSelectedUsuario(item)             │
│    setIsEditDialogOpen(true)            │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 4. UsuarioForm.jsx se abre              │
│    Carga defaultValues en el formulario │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 5. Usuario modifica campos y envía     │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 6. UsuarioForm.jsx - handleSubmit       │
│    onSubmit(data)                       │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 7. Usuario.jsx - handleUpdateSubmit     │
│    handleUpdate(id, data, selected)     │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 8. useUsuario.js - handleUpdate         │
│    await putUsuario(id, payload)        │
│    await fetchUsuarios()                │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 9. usuarioService.js - putUsuario       │
│    putGeneric('/usuarios/123', data)    │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 10. genericService.js - putGeneric      │
│     await api.put(endpoint, data)       │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 11. Backend procesa y responde          │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 12. Hook actualiza el estado            │
│     setUsuarios(newData)                │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ 13. Componente se re-renderiza          │
│     Tabla muestra datos actualizados    │
│     Diálogo se cierra                   │
└─────────────────────────────────────────┘
```

---

## 🎓 Resumen

| Componente | Responsabilidad | Tecnologías |
|------------|----------------|-------------|
| `Usuario.jsx` | Orquesta toda la página, maneja diálogos | React useState |
| `UsuarioForm.jsx` | Formulario con validación | React Hook Form |
| `UsuarioTable.jsx` | Tabla con filtros y paginación | TanStack Table |
| `UsuarioTableColumns.jsx` | Define estructura de columnas | TanStack Table |

---

## 🔗 Referencias

- [TanStack Table](./TANSTACK_TABLE.md)
- [Hooks](./HOOKS.md)
- [Servicios](./SERVICES.md)
