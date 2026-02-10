import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Tag, Truck, Activity } from 'lucide-react';
import { ArrowUpDown } from 'lucide-react';

export const createVehiculoColumns = (onEdit, onDelete, onView) => [
  {
    accessorKey: 'patente',
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
      const patente = row.original.patente || 'Sin patente';
      return (
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{patente}</span>
        </div>
      );
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
          <Activity className="h-4 w-4 text-gray-500" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            estado  === 'HABILITADO' 
              ? 'bg-green-100 text-green-700' 
              : estado === 'EN_MANTENIMIENTO'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {estado || 'Sin estado'}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'tipo',
    header: 'Tipo',
    cell: ({ row }) => {
      const tipo = row.original.tipo;
      const tipoLower = tipo?.toLowerCase() || '';
    //const tipoLabel = tipoLower === 'camion' ? 'Camión' : tipoLower === 'acoplado' ? 'Acoplado' : tipo || 'Sin tipo';
      const tipoLabel = tipoLower === 'ligero' ? 'Ligero' : tipoLower === 'mediano' ? 'Mediano' : tipoLower === 'pesado' ? 'Pesado' : tipoLower === 'terapesado' ? 'TeraPesado' : tipo || 'Sin tipo';
      
      //marca de agua
      return (
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-gray-500" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            tipoLower === 'ligero' 
              ? 'bg-blue-100 text-blue-700' 
              : tipoLower === 'mediano'
              ? 'bg-purple-100 text-purple-700'
              : tipoLower === 'pesado'
              ? 'bg-indigo-100 text-indigo-700'
              : tipoLower === 'terapesado'
              ? 'bg-teal-100 text-teal-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {tipoLabel}
          </span>
        </div>
      );
    },
  },
  {
    id: 'acciones',
    header: 'Acciones',
    cell: ({ row }) => {
      const vehiculo = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-blue-50"
            onClick={() => onView && onView(vehiculo)}
            title="Ver detalles"
          >
            <Eye className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-yellow-50"
            onClick={() => onEdit(vehiculo)}
            title="Editar"
          >
            <Edit className="h-4 w-4 text-yellow-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-red-50"
            onClick={() => onDelete(vehiculo)}
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      );
    },
  },
];
