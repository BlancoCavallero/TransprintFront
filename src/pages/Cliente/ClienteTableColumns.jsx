import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Mail, Phone, Building, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import { ArrowUpDown } from 'lucide-react';

// Función para remover acentos y tildes
const removeAccents = (text) => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

// Función de filtrado personalizada que ignora acentos
const filterAccentInsensitive = (row, columnId, filterValue) => {
  const cellValue = row.getValue(columnId);
  const normalizedCell = removeAccents(String(cellValue || '').toLowerCase());
  const normalizedFilter = removeAccents(filterValue.toLowerCase());
  return normalizedCell.includes(normalizedFilter);
};

export const createClienteColumns = (onEdit, onDelete, onView, onReactivar, loadingReactivar) => [
  {
    accessorKey: 'nombreCompleto',
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
    cell: ({ row }) => {
      const nombre = row.original.persona?.nombre || row.original.nombre || '';
      const apellido = row.original.persona?.apellido || row.original.apellido || '';
      return `${nombre} ${apellido}`.trim() || 'Sin nombre';
    },
  },
  {
    accessorKey: 'correo',
    header: 'Email',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500" />
          <span>{row.original.correo}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'telefono',
    header: 'Teléfono',
    cell: ({ row }) => {
      const telefono = row.original.persona?.telefono || row.original.telefono || 'Sin teléfono';
      return (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-500" />
          <span>{telefono}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'tipo',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tipo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const tipo = row.original.tipo;
      return (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-gray-500" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            tipo === 'Empresa' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {tipo}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'activo',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Estado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isActivo = row.original.activo === 1;
      return (
        <div className="flex items-center gap-2">
          {isActivo ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                Activo
              </span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                Inactivo
              </span>
            </>
          )}
        </div>
      );
    },
  },
  {
    id: 'acciones',
    header: 'Acciones',
    cell: ({ row }) => {
      const cliente = row.original;
      const isActivo = cliente.activo === 1;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-blue-50"
            onClick={() => onView && onView(cliente)}
            title="Ver detalles"
          >
            <Eye className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-yellow-50"
            onClick={() => onEdit(cliente)}
            title="Editar"
          >
            <Edit className="h-4 w-4 text-yellow-600" />
          </Button>
          {isActivo ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-red-50"
              onClick={() => onDelete(cliente)}
              title="Dar de baja"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-green-50"
              onClick={() => onReactivar && onReactivar(cliente)}
              disabled={loadingReactivar}
              title="Reactivar cliente"
            >
              <RotateCcw className="h-4 w-4 text-green-600" />
            </Button>
          )}
        </div>
      );
    },
  },
];