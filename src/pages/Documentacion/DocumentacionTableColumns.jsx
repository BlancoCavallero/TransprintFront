import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, FileText, Calendar, Activity } from 'lucide-react';
import { ArrowUpDown } from 'lucide-react';

export const createDocumentacionColumns = (onEdit, onDelete, onView) => [
  {
    accessorKey: 'nombre',
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
      const nombre = row.original.nombre;
      return (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{nombre || 'Sin tipo'}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ row }) => {
      const estado = row.original.estado;
      const getEstadoColor = (estado) => {
        if (!estado) return 'bg-gray-100 text-gray-700';
        const estadoLower = estado.toLowerCase();
        if (estadoLower === 'vigente') return 'bg-green-100 text-green-700';
        if (estadoLower === 'vencida') return 'bg-red-100 text-red-700';
        if (estadoLower === 'por vencer') return 'bg-yellow-100 text-yellow-700';
        return 'bg-gray-100 text-gray-700';
      };

      return (
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-gray-400" />
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(estado)}`}>
            {estado || 'Sin estado'}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'fechaVencimiento',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Fecha Vencimiento
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const fecha = row.original.fechaVencimiento;
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{fecha || 'Sin fecha'}</span>
        </div>
      );
    },
  },
  {
    id: 'acciones',
    header: 'Acciones',
    cell: ({ row }) => {
      const doc = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView && onView(doc)}
            title="Ver detalles"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit && onEdit(doc)}
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete && onDelete(doc)}
            title="Eliminar"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
