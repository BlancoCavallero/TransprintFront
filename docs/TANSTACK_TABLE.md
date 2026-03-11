# TanStack Table - Guía de Implementación

## 📋 Índice
- [¿Qué es TanStack Table?](#qué-es-tanstack-table)
- [Conceptos Clave](#conceptos-clave)
- [Implementación en el Proyecto](#implementación-en-el-proyecto)
- [Features Disponibles](#features-disponibles)
- [Ejemplos Avanzados](#ejemplos-avanzados)

---

## 🎯 ¿Qué es TanStack Table?

**TanStack Table** (antes React Table) es una librería headless para construir tablas potentes y flexibles.

### Características
- ✅ **Headless**: Solo lógica, tú controlas el UI
- ✅ **Modular**: Solo incluyes las features que necesitas
- ✅ **TypeScript**: Fuertemente tipado
- ✅ **Framework Agnostic**: Funciona con React, Vue, Svelte, Solid
- ✅ **Performante**: Virtualización, memoización

### ¿Por qué Headless?
```javascript
// Headless = Sin UI predefinida
// TÚ defines cómo se ve
<Table>           ← Tu componente
  <TableHeader>   ← Tu componente
    <TableRow>    ← Tu componente
```

**Ventaja**: Control total sobre el diseño y estilos.

---

## 🧩 Conceptos Clave

### 1. **Columns (Columnas)**
Definen QUÉ datos mostrar y CÓMO mostrarlos.

```javascript
const columns = [
  {
    accessorKey: 'nombre',     // Campo del objeto
    header: 'Nombre',          // Texto del encabezado
    cell: ({ row }) => <span>{row.original.nombre}</span> // Renderizado
  }
];
```

### 2. **Data (Datos)**
Array de objetos con los datos de la tabla.

```javascript
const data = [
  { id: 1, nombre: 'Juan', edad: 30 },
  { id: 2, nombre: 'María', edad: 25 },
];
```

### 3. **Table Instance**
Objeto que maneja toda la lógica de la tabla.

```javascript
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
});
```

### 4. **Row Model**
Define cómo se procesan las filas (filtrado, ordenamiento, paginación).

```javascript
getCoreRowModel: getCoreRowModel(),           // Básico
getPaginationRowModel: getPaginationRowModel(), // Con paginación
getSortedRowModel: getSortedRowModel(),       // Con ordenamiento
getFilteredRowModel: getFilteredRowModel(),   // Con filtros
```

---

## 🏗️ Implementación en el Proyecto

### Estructura

```
UsuarioTable.jsx          → Renderiza la tabla
UsuarioTableColumns.jsx   → Define las columnas
```

### `UsuarioTableColumns.jsx`

```javascript
import { ArrowUpDown, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const createUsuarioColumns = (onEdit, onDelete) => [
  // Columna con ordenamiento
  {
    accessorKey: 'nombre_completo',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  // Columna simple
  {
    accessorKey: 'username',
    header: 'Usuario',
  },

  // Columna con renderizado personalizado
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500" />
          <span>{row.original.email}</span>
        </div>
      );
    },
  },

  // Columna calculada (no es campo de datos)
  {
    id: 'role',
    header: 'Rol',
    cell: ({ row }) => {
      const role = row.original.role || row.original.roles?.[0] || 'Sin rol';
      return (
        <div className="flex items-center gap-2">
          <UserCircle className="h-4 w-4" />
          <span>{role}</span>
        </div>
      );
    },
  },

  // Columna de acciones
  {
    id: 'acciones',
    header: 'Acciones',
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(item)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(item)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
```

#### Tipos de Columnas

##### **1. Columna con accessorKey**
```javascript
{
  accessorKey: 'nombre',
  header: 'Nombre',
}
```
- Extrae automáticamente `row.nombre`
- Renderizado automático del valor

##### **2. Columna con header personalizado**
```javascript
{
  accessorKey: 'nombre',
  header: ({ column }) => (
    <Button onClick={() => column.toggleSorting()}>
      Nombre <ArrowUpDown />
    </Button>
  ),
}
```
- `column` tiene métodos como `toggleSorting()`, `getIsSorted()`
- Puedes hacer el header interactivo

##### **3. Columna con cell personalizado**
```javascript
{
  accessorKey: 'email',
  cell: ({ row }) => (
    <div>
      <Mail /> {row.original.email}
    </div>
  ),
}
```
- `row.original` es el objeto completo
- Control total sobre el renderizado

##### **4. Columna sin accessorKey (calculada)**
```javascript
{
  id: 'fullName',
  header: 'Nombre Completo',
  cell: ({ row }) => `${row.original.nombre} ${row.original.apellido}`,
}
```
- Usa `id` en lugar de `accessorKey`
- Valores calculados o combinados

---

### `UsuarioTable.jsx`

```javascript
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { useState } from 'react';

export const UsuarioTable = ({ columns, data }) => {
  // Estados para features
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  // Configurar la tabla
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
    <div className="space-y-4">
      {/* Filtro */}
      <Input
        placeholder="Filtrar por nombre..."
        value={table.getColumn('nombre_completo')?.getFilterValue() ?? ''}
        onChange={(event) =>
          table.getColumn('nombre_completo')?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />

      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          {/* Header */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* Body */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};
```

---

## 🎨 Features Disponibles

### 1️⃣ **Ordenamiento (Sorting)**

#### Configuración
```javascript
const [sorting, setSorting] = useState([]);

const table = useReactTable({
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: setSorting,
  state: { sorting },
});
```

#### En la Columna
```javascript
{
  header: ({ column }) => (
    <Button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      Nombre <ArrowUpDown />
    </Button>
  ),
}
```

#### Estado de Sorting
```javascript
// Ordenar por nombre ascendente
[{ id: 'nombre', desc: false }]

// Ordenar por edad descendente
[{ id: 'edad', desc: true }]

// Sin ordenamiento
[]
```

---

### 2️⃣ **Filtros (Filtering)**

#### Configuración
```javascript
const [columnFilters, setColumnFilters] = useState([]);

const table = useReactTable({
  getFilteredRowModel: getFilteredRowModel(),
  onColumnFiltersChange: setColumnFilters,
  state: { columnFilters },
});
```

#### Input de Filtro
```javascript
<Input
  value={table.getColumn('nombre')?.getFilterValue() ?? ''}
  onChange={(e) =>
    table.getColumn('nombre')?.setFilterValue(e.target.value)
  }
/>
```

#### Filtros Personalizados
```javascript
{
  accessorKey: 'edad',
  filterFn: (row, columnId, filterValue) => {
    return row.getValue(columnId) > filterValue;
  },
}
```

---

### 3️⃣ **Paginación**

#### Configuración
```javascript
const table = useReactTable({
  getPaginationRowModel: getPaginationRowModel(),
});
```

#### Controles
```javascript
<Button onClick={() => table.previousPage()}>Anterior</Button>
<Button onClick={() => table.nextPage()}>Siguiente</Button>

<span>
  Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
</span>

<select
  value={table.getState().pagination.pageSize}
  onChange={(e) => table.setPageSize(Number(e.target.value))}
>
  <option value={10}>10</option>
  <option value={20}>20</option>
  <option value={50}>50</option>
</select>
```

---

### 4️⃣ **Row Selection (Selección de Filas)**

#### Configuración
```javascript
const [rowSelection, setRowSelection] = useState({});

const table = useReactTable({
  getRowId: (row) => row.id,
  onRowSelectionChange: setRowSelection,
  state: { rowSelection },
});
```

#### Columna de Checkbox
```javascript
{
  id: 'select',
  header: ({ table }) => (
    <Checkbox
      checked={table.getIsAllRowsSelected()}
      onChange={table.getToggleAllRowsSelectedHandler()}
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onChange={row.getToggleSelectedHandler()}
    />
  ),
}
```

---

## 🚀 Ejemplos Avanzados

### Columna con Badge de Estado
```javascript
{
  accessorKey: 'status',
  header: 'Estado',
  cell: ({ row }) => {
    const status = row.original.status;
    const variant = status === 'active' ? 'success' : 'destructive';
    return <Badge variant={variant}>{status}</Badge>;
  },
}
```

### Columna con Tooltip
```javascript
{
  accessorKey: 'descripcion',
  header: 'Descripción',
  cell: ({ row }) => (
    <Tooltip content={row.original.descripcion}>
      <span className="truncate max-w-xs">
        {row.original.descripcion}
      </span>
    </Tooltip>
  ),
}
```

### Columna con Fecha Formateada
```javascript
{
  accessorKey: 'createdAt',
  header: 'Fecha de Creación',
  cell: ({ row }) => {
    return new Date(row.original.createdAt).toLocaleDateString('es-ES');
  },
}
```

### Filtro de Rango de Fechas
```javascript
{
  accessorKey: 'fecha',
  filterFn: (row, columnId, filterValue) => {
    const [start, end] = filterValue;
    const date = new Date(row.getValue(columnId));
    return date >= start && date <= end;
  },
}
```

---

## 🎓 Mejores Prácticas

### ✅ **DO - Hacer**
- ✅ Usa `getRowId` para identificar filas únicas
- ✅ Memoiza las columnas con `useMemo` para mejor rendimiento
- ✅ Usa `flexRender` para renderizar headers y cells
- ✅ Maneja el caso de "no hay datos"

### ❌ **DON'T - No Hacer**
- ❌ No modifiques `data` directamente (usa estados inmutables)
- ❌ No renderices lógica pesada en `cell` sin memoización
- ❌ No uses índices como row IDs (usa IDs únicos)

---

## 🔗 Referencias

- [TanStack Table Docs](https://tanstack.com/table/v8)
- [React Hook Form](https://react-hook-form.com/)
- [Shadcn UI](https://ui.shadcn.com/)
