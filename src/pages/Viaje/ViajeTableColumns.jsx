import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, User, Truck, MapPin, Calendar, DollarSign, Activity } from 'lucide-react';
import { ArrowUpDown } from 'lucide-react';

export const createViajeColumns = (onEdit, onDelete, onView) => [
  {
    accessorKey: 'cliente.razonSocial',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Cliente
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const cliente = row.original.cliente;
      const nombre = cliente?.razonSocial || 
                     (cliente?.persona ? `${cliente.persona.nombre} ${cliente.persona.apellido}` : 'Sin cliente');
      return (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{nombre}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'vehiculo.patente',
    header: 'Vehículo',
    cell: ({ row }) => {
      const vehiculo = row.original.vehiculo;
      return (
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-gray-500" />
          <span>{vehiculo?.patente || 'Sin vehículo'}</span>
        </div>
      );
    },
  },
  {
    id: 'ruta',
    accessorFn: (row) => {
      const origen = row.localidadOrigen?.nombre || ``;
      const destino = row.localidadDestino?.nombre || ``;
      return `${origen} ${destino}`.trim();
    },
    cell: ({ row }) => {
      const viaje = row.original;
      const origen = viaje.localidadOrigen?.nombre || `Loc. ${viaje.idLocalidadOrigen}`;
      const destino = viaje.localidadDestino?.nombre || `Loc. ${viaje.idLocalidadDestino}`;
      
      return (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{origen} → {destino}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'chofer',
    header: 'Chofer',
    cell: ({ row }) => {
      const chofer = row.original.chofer;
      const nombre = chofer?.persona ? `${chofer.persona.nombre} ${chofer.persona.apellido}` : 'Sin chofer';
      return <span>{nombre}</span>;
    },
  },
  {
    accessorKey: 'fechaInicio',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Fecha Inicio
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const fecha = row.original.fechaInicio;
      const fechaFormateada = fecha ? new Date(fecha).toLocaleDateString('es-ES') : 'Sin fecha';
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>{fechaFormateada}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'fechaFin',
    header: 'Fecha Fin',
    cell: ({ row }) => {
      const fecha = row.original.fechaFin;
      const fechaFormateada = fecha ? new Date(fecha).toLocaleDateString('es-ES') : 'Sin fecha';
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>{fechaFormateada}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'precio',
    header: 'Precio',
    cell: ({ row }) => {
      const precio = row.original.precio;
      return (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-gray-500" />
          <span className="font-medium">${precio?.toLocaleString('es-ES') || 0}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'estado',
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
      const estado = row.original.estado;
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