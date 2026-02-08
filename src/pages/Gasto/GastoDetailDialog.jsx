import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DollarSign, FileText, Hash, MapPin, Activity, Tag } from 'lucide-react';

export const GastoDetailDialog = ({ open, onOpenChange, gasto }) => {
  if (!gasto) return null;

  const getTipoColor = (tipo) => {
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

  const getEstadoColor = (estado) => {
    if (!estado) return 'bg-gray-100 text-gray-700';
    const estadoUpper = estado.toUpperCase();
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Detalles del Gasto
          </DialogTitle>
          <DialogDescription>
            Información completa del gasto y viaje asociado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del Gasto */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Información del Gasto</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Tipo de Gasto</p>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTipoColor(gasto.tipo)}`}>
                    {gasto.tipo || 'Sin tipo'}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500">Monto</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <p className="text-sm font-medium">${gasto.monto?.toLocaleString('es-ES') || 0}</p>
                </div>
              </div>

              <div className="space-y-1 col-span-2">
                <p className="text-xs text-gray-500">Detalle</p>
                <div className="flex items-start gap-2">
                  <Hash className="h-4 w-4 text-gray-400 mt-0.5" />
                  <p className="text-sm bg-gray-50 p-3 rounded-md border border-gray-200 flex-1">
                    {gasto.detalle || 'Sin detalle'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Información del Viaje */}
          {gasto.viaje && (
            <div className="space-y-3 pt-3 border-t">
              <h3 className="text-sm font-semibold text-gray-900">Información del Viaje</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Estado del Viaje</p>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-gray-400" />
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(gasto.viaje.estado)}`}>
                      {gasto.viaje.estado || 'Sin estado'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Kilómetros</p>
                  <p className="text-sm font-medium">{gasto.viaje.kilometros || 0} km</p>
                </div>
{/* 
                <div className="space-y-1 col-span-2">
                  <p className="text-xs text-gray-500">Ruta</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">
                      Origen (ID: {gasto.viaje.idLocalidadOrigen}) → Destino (ID: {gasto.viaje.idLocalidadDestino})
                    </p>
                  </div>
                </div> */}

                {gasto.viaje.chofer && (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Chofer</p>
                    <p className="text-sm font-medium">
                      {gasto.viaje.chofer.persona?.nombre} {gasto.viaje.chofer.persona?.apellido}
                    </p>
                  </div>
                )}

                {gasto.viaje.vehiculo && (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Vehículo</p>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <p className="text-sm font-medium">
                        {gasto.viaje.vehiculo.patente} - {gasto.viaje.vehiculo.marca} {gasto.viaje.vehiculo.modelo}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {gasto.viaje.observaciones && (
                <div className="space-y-1 pt-2">
                  <p className="text-xs text-gray-500">Observaciones del Viaje</p>
                  <p className="text-sm bg-gray-50 p-3 rounded-md border border-gray-200">
                    {gasto.viaje.observaciones}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
