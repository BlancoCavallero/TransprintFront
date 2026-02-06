import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileText, Calendar, Activity, Hash, User, Truck, Tag } from 'lucide-react';

export const DocumentacionDetailDialog = ({ open, onOpenChange, documentacion }) => {
  if (!documentacion) return null;

  const getEstadoColor = (estado) => {
    if (!estado) return 'bg-gray-100 text-gray-700';
    const estadoLower = estado.toLowerCase();
    if (estadoLower === 'vigente') return 'bg-green-100 text-green-700';
    if (estadoLower === 'vencida') return 'bg-red-100 text-red-700';
    if (estadoLower === 'por vencer') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalles de la Documentación
          </DialogTitle>
          <DialogDescription>
            Información completa de la documentación
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información de la Documentación */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Información de la Documentación</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Tipo</p>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <p className="text-sm font-medium">{documentacion.nombre || 'Sin tipo'}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500">Estado</p>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-gray-400" />
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(documentacion.estado)}`}>
                    {documentacion.estado || 'Sin estado'}
                  </span>
                </div>
              </div>

              <div className="space-y-1 col-span-2">
                <p className="text-xs text-gray-500">Fecha de Vencimiento</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-sm">{documentacion.fechaVencimiento || 'Sin fecha'}</p>
                </div>
              </div>

              {documentacion.renovacion && (
                <div className="space-y-1 col-span-2">
                  <p className="text-xs text-gray-500">Renovación (días)</p>
                  <p className="text-sm font-medium">{documentacion.renovacion}</p>
                </div>
              )}
            </div>
          </div>

          {/* Detalle */}
          {documentacion.detalle && (
            <div className="space-y-3 pt-3 border-t">
              <h3 className="text-sm font-semibold text-gray-900">Detalle</h3>
              <p className="text-sm bg-gray-50 p-3 rounded-md border border-gray-200">
                {documentacion.detalle}
              </p>
            </div>
          )}

          {/* Información de la Entidad Asociada */}
          {documentacion.tipoEntidad === 'CHOFER' && documentacion.chofer && (
            <div className="space-y-3 pt-3 border-t">
              <h3 className="text-sm font-semibold text-gray-900">Chofer Asociado</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Nombre</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <p className="text-sm font-medium">
                      {documentacion.chofer.persona
                        ? `${documentacion.chofer.persona.nombre} ${documentacion.chofer.persona.apellido}`
                        : 'Sin nombre'}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500">DNI</p>
                  <p className="text-sm">{documentacion.chofer.dni || 'Sin DNI'}</p>
                </div>
              </div>
            </div>
          )}

          {documentacion.tipoEntidad === 'VEHICULO' && documentacion.vehiculo && (
            <div className="space-y-3 pt-3 border-t">
              <h3 className="text-sm font-semibold text-gray-900">Vehículo Asociado</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Patente</p>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <p className="text-sm font-medium">{documentacion.vehiculo.patente || 'Sin patente'}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Marca y Modelo</p>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">
                      {documentacion.vehiculo.marca} {documentacion.vehiculo.modelo}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Información del Sistema */}
          <div className="space-y-3 pt-3 border-t">
            <h3 className="text-sm font-semibold text-gray-900">Información del Sistema</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">ID Documentación</p>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <p className="text-sm font-mono">{documentacion.idDocumentacion || 'Sin ID'}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500">Tipo Entidad</p>
                <p className="text-sm font-medium">{documentacion.tipoEntidad || 'Sin tipo'}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
