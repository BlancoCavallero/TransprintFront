import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Wrench, Calendar, Truck, Tag, Hash, FileText, Activity } from 'lucide-react';

export const MantenimientoDetailDialog = ({ open, onOpenChange, mantenimiento }) => {
  if (!mantenimiento) return null;

  const getTipoMantenimientoColor = (tipo) => {
    if (!tipo) return 'bg-gray-100 text-gray-700';
    const tipoLower = tipo.toLowerCase();
    if (tipoLower === 'preventivo') return 'bg-green-100 text-green-700';
    if (tipoLower === 'correctivo') return 'bg-orange-100 text-orange-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getTipoVehiculoColor = (tipo) => {
    if (!tipo) return 'bg-gray-100 text-gray-700';
    const tipoLower = tipo.toLowerCase();
    if (tipoLower === 'camion') return 'bg-blue-100 text-blue-700';
    if (tipoLower === 'acoplado') return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getTipoVehiculoLabel = (tipo) => {
    if (!tipo) return 'Sin tipo';
    const tipoLower = tipo.toLowerCase();
    if (tipoLower === 'camion') return 'Camión';
    if (tipoLower === 'acoplado') return 'Acoplado';
    return tipo;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Detalles del Mantenimiento
          </DialogTitle>
          <DialogDescription>
            Información completa del mantenimiento y vehículo asociado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del Mantenimiento */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Información del Mantenimiento</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Tipo de Mantenimiento</p>
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-gray-400" />
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTipoMantenimientoColor(mantenimiento.tipo)}`}>
                    {mantenimiento.tipo || 'Sin tipo'}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500">ID Mantenimiento</p>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <p className="text-sm font-mono">{mantenimiento.idMantenimiento || 'Sin ID'}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500">Fecha de Inicio</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-sm font-medium">{mantenimiento.fechaInicio || 'Sin fecha'}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500">Fecha de Fin</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-sm font-medium">{mantenimiento.fechaFin || 'Sin fecha'}</p>
                </div>
              </div>
            </div>

            {mantenimiento.observaciones && (
              <div className="space-y-1 pt-2">
                <p className="text-xs text-gray-500">Observaciones</p>
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                  <p className="text-sm bg-gray-50 p-3 rounded-md border border-gray-200 flex-1">
                    {mantenimiento.observaciones}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Información del Vehículo */}
          {mantenimiento.vehiculo && (
            <div className="space-y-3 pt-3 border-t">
              <h3 className="text-sm font-semibold text-gray-900">Información del Vehículo</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Patente</p>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <p className="text-sm font-medium">{mantenimiento.vehiculo.patente || 'Sin patente'}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Tipo de Vehículo</p>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-400" />
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTipoVehiculoColor(mantenimiento.vehiculo.tipo)}`}>
                      {getTipoVehiculoLabel(mantenimiento.vehiculo.tipo)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Marca</p>
                  <p className="text-sm font-medium">{mantenimiento.vehiculo.marca || 'Sin marca'}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Modelo</p>
                  <p className="text-sm font-medium">{mantenimiento.vehiculo.modelo || 'Sin modelo'}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500">ID del Vehículo</p>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-400" />
                    <p className="text-sm font-mono">{mantenimiento.vehiculo.idVehiculo || 'Sin ID'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
