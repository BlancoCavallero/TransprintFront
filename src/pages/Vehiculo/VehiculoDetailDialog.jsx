import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Truck, Calendar, Tag, Activity, Hash } from 'lucide-react';

export const VehiculoDetailDialog = ({ open, onOpenChange, vehiculo }) => {
  if (!vehiculo) return null;

  const getEstadoColor = (estado) => {
    if (!estado) return 'bg-gray-100 text-gray-700';
    const estadoLower = estado.toLowerCase();
    if (estadoLower === 'activo') return 'bg-green-100 text-green-700';
    if (estadoLower === 'inactivo') return 'bg-red-100 text-red-700';
    if (estadoLower === 'en mantenimiento') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getTipoColor = (tipo) => {
    if (!tipo) return 'bg-gray-100 text-gray-700';
    const tipoLower = tipo.toLowerCase();
    if (tipoLower === 'camion') return 'bg-blue-100 text-blue-700';
    if (tipoLower === 'acoplado') return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getTipoLabel = (tipo) => {
    if (!tipo) return 'Sin tipo';
    const tipoLower = tipo.toLowerCase();
    if (tipoLower === 'camion') return 'Camión';
    if (tipoLower === 'acoplado') return 'Acoplado';
    return tipo;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Detalles del Vehículo
          </DialogTitle>
          <DialogDescription>
            Información completa del vehículo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del Vehículo */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Información del Vehículo</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Patente</p>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <p className="text-sm font-medium">{vehiculo.patente || 'Sin patente'}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500">Marca</p>
                <p className="text-sm font-medium">{vehiculo.marca || 'Sin marca'}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500">Modelo</p>
                <p className="text-sm font-medium">{vehiculo.modelo || 'Sin modelo'}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500">Año</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-sm font-medium">{vehiculo.anio || 'Sin año'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Estado y Tipo */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Estado y Tipo</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Estado</p>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-gray-400" />
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(vehiculo.estado)}`}>
                    {vehiculo.estado || 'Sin estado'}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500">Tipo</p>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-gray-400" />
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTipoColor(vehiculo.tipo)}`}>
                    {getTipoLabel(vehiculo.tipo)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Información del Sistema */}
          <div className="space-y-3 pt-3 border-t">
            <h3 className="text-sm font-semibold text-gray-900">Información del Sistema</h3>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">ID del Vehículo</p>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-400" />
                <p className="text-sm font-mono">{vehiculo.idVehiculo || 'Sin ID'}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
