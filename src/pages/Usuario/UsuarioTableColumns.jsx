import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Mail, UserCircle } from 'lucide-react';
import { ArrowUpDown } from 'lucide-react';

export const createUsuarioColumns = (onEdit, onDelete, onView) => [
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
  {
    accessorKey: 'username',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Usuario
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
    id: 'role',
    header: 'Rol',
    cell: ({ row }) => {
      const role = row.original.role || row.original.roles?.[0] || 'Sin rol';

      return (
        <div className="flex items-center gap-2">
          <UserCircle className="h-4 w-4 text-gray-500" />
          <span>{role}</span>
        </div>
      );
    },
  },
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
            className="h-8 w-8 p-0 hover:bg-blue-50"
            onClick={() => onView && onView(item)}
            title="Ver detalles"
          >
            <Eye className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-yellow-50"
            onClick={() => onEdit(item)}
            title="Editar"
          >
            <Edit className="h-4 w-4 text-yellow-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-red-50"
            onClick={() => onDelete(item)}
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      );
    },
  },
];
