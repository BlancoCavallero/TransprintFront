import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Phone, Truck, AlertCircle, RotateCcw } from "lucide-react";
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

export const createChoferColumns = (onEdit, onDelete, onView, onReactivar, loadingReactivar) => [
  {
    accessorKey: 'nombreCompleto',
    filterFn: filterAccentInsensitive,
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
    accessorKey: 'cuit',
    header: 'CUIT',
    cell: ({ row }) => {
      const cuit = row.original.persona?.cuit || row.original.cuit || 'Sin CUIT';
      return <span className="font-mono">{cuit}</span>;
    },
  },
  {
    accessorKey: 'estadoDisponibilidad',
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
      const estado = row.original.estadoDisponibilidad;
      return (
        <div className="flex items-center gap-2">
          {estado === 'HABILITADO' && <AlertCircle className="h-4 w-4 text-green-500" />}
          {estado === 'INHABILITADO' && <AlertCircle className="h-4 w-4 text-red-500" />}
          {estado === 'OCUPADO' && <Truck className="h-4 w-4 text-blue-500" />}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            estado === 'HABILITADO' 
              ? 'bg-green-100 text-green-700' 
              : estado === 'OCUPADO'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {estado || 'Sin estado'}
          </span>
        </div>
      );
    },
  },
  {
    id: 'acciones',
    header: 'Acciones',
    cell: ({ row }) => {
      const chofer = row.original;
      const isDeBaja = chofer.estadoDisponibilidad === 'DE_BAJA';

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-blue-50"
            onClick={() => onView && onView(chofer)}
            title="Ver detalles"
          >
            <Eye className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-yellow-50"
            onClick={() => onEdit(chofer)}
            title="Editar"
          >
            <Edit className="h-4 w-4 text-yellow-600" />
          </Button>
          {isDeBaja ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-green-50"
              onClick={() => onReactivar && onReactivar(chofer)}
              disabled={loadingReactivar}
              title="Reactivar chofer"
            >
              <RotateCcw className="h-4 w-4 text-green-600" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-red-50"
              onClick={() => onDelete(chofer)}
              title="Dar de baja"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          )}
        </div>
      );
    },
  },
];