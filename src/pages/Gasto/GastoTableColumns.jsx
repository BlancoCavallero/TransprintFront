import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, DollarSign, FileText, Activity, MapPin } from 'lucide-react';
import { ArrowUpDown } from 'lucide-react';

export const createGastoColumns = (onEdit, onDelete, onView) => [
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
      
      const getTipoColor = () => {
        switch (tipo) {
          case 'Combustible':
            return 'bg-blue-100 text-blue-700';
          case 'Peaje':
            return 'bg-purple-100 text-purple-700';
          case 'Viatico':
            return 'bg-green-100 text-green-700';
          default:
            return 'bg-gray-100 text-gray-700';
        }
      };
      
      return (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor()}`}>
            {tipo || 'Sin tipo'}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'monto',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Monto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const monto = row.original.monto;
      return (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-gray-500" />
          <span className="font-medium">${monto?.toLocaleString('es-ES') || 0}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'viaje.estado',
    header: 'Estado del Viaje',
    cell: ({ row }) => {
      const estado = row.original.viaje?.estado;
      const estadoUpper = estado?.toUpperCase() || '';
      
      const getEstadoColor = () => {
        switch (estadoUpper) {
          case 'PROGRAMADO':
            return 'bg-blue-100 text-blue-700';
          case 'EN_CURSO':
          case 'EN CURSO':
            return 'bg-yellow-100 text-yellow-700';
          case 'FINALIZADO':
            return 'bg-green-100 text-green-700';
          case 'CANCELADO':
            return 'bg-red-100 text-red-700';
          default:
            return 'bg-gray-100 text-gray-700';
        }
      };
      
      return (
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-gray-500" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor()}`}>
            {estado || 'Sin estado'}
          </span>
        </div>
      );
    },
  },
  // {
  //   id: 'ruta',
  //   header: 'Ruta',
  //   cell: ({ row }) => {
  //     const viaje = row.original.viaje;
  //     const origen = viaje?.localidadOrigen?.localidad || `Loc. ${viaje?.idLocalidadOrigen}`;
  //     const destino = viaje?.localidadDestino?.localidad || `Loc. ${viaje?.idLocalidadDestino}`;
      
  //     return (
  //       <div className="flex items-center gap-2">
  //         <MapPin className="h-4 w-4 text-gray-500" />
  //         <span className="text-sm">{origen} → {destino}</span>
  //       </div>
  //     );
  //   },
  // },
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
