import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Mail, Phone, Building } from "lucide-react";
import { ArrowUpDown } from 'lucide-react';

export const createChoferColumns = (onEdit, onDelete, onView) => [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'nombre',
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
  {
    accessorKey: 'telefono',
    header: 'Teléfono',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-500" />
          <span>{row.original.telefono}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'empresa',
    header: 'Empresa',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-gray-500" />
          <span>{row.original.empresa}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'fechaCreacion',
    header: 'Fecha',
    cell: ({ row }) => {
      const fecha = row.original.fechaCreacion;
      return new Date(fecha).toLocaleDateString('es-ES');
    },
  },
  {
    id: 'acciones',
    header: 'Acciones',
    cell: ({ row }) => {
      const cliente = row.original;

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
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-red-50"
            onClick={() => onDelete(cliente)}
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      );
    },
  },
];