import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Tag, Truck, Calendar, Wrench } from 'lucide-react';
import { ArrowUpDown } from 'lucide-react';

export const createMantenimientoColumns = (onEdit, onDelete, onView) => [
  {
    accessorKey: 'vehiculo.patente',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Patente
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const patente = row.original.vehiculo?.patente || 'Sin patente';
      return (
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{patente}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'vehiculo.tipo',
    header: 'Tipo Vehículo',
    cell: ({ row }) => {
      const tipo = row.original.vehiculo?.tipo;
      const tipoLower = tipo?.toLowerCase() || '';
      const tipoLabel = tipoLower === 'ligero' ? 'Ligero' : tipoLower === 'mediano' ? 'Mediano' : tipoLower === 'pesado' ? 'Pesado' : tipoLower === 'terapesado' ? 'Terapesado' : tipo || 'Sin tipo';
      
      return (
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-gray-500" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            tipoLower === 'ligero' 
              ? 'bg-blue-100 text-blue-700' 
              : tipoLower === 'mediano'
              ? 'bg-purple-100 text-purple-700'
              : tipoLower === 'pesado'
              ? 'bg-red-100 text-red-700'
              : tipoLower === 'terapesado'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {tipoLabel}
          </span>
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
          Tipo Mantenimiento
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const tipo = row.original.tipo;
      const tipoLower = tipo?.toLowerCase() || '';
      
      return (
        <div className="flex items-center gap-2">
          <Wrench className="h-4 w-4 text-gray-500" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            tipoLower === 'preventivo' 
              ? 'bg-green-100 text-green-700' 
              : tipoLower === 'correctivo'
              ? 'bg-orange-100 text-orange-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {tipo || 'Sin tipo'}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'fechaFin',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Fecha Fin
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const fecha = row.original.fechaFin;
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>{fecha || 'Sin fecha'}</span>
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