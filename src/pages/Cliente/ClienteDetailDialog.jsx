import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Mail, Phone, Building, MapPin, User, FileText, Hash, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ClienteDetailDialog = ({ open, onOpenChange, cliente, onReactivar, loadingReactivar }) => {
  if (!cliente) return null;

  const estaDeBaja = cliente.estado === 'DE_BAJA';

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Activo':
      case 'ACTIVO':
        return 'bg-green-100 text-green-700';
      case 'DE_BAJA':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatCuit = (cuit) => {
    if (!cuit) return 'No especificado';
    const cuitStr = String(cuit);
    if (cuitStr.length === 11) {
      return `${cuitStr.slice(0, 2)}-${cuitStr.slice(2, 10)}-${cuitStr.slice(10)}`;
    }
    return cuitStr;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            Detalles del Cliente
          </DialogTitle>
          <DialogDescription>
            Información completa del cliente
          </DialogDescription>
        </DialogHeader>

        {/* Estado Badge */}
        {cliente.estado && (
          <div className="flex justify-start">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${ getEstadoColor(cliente.estado)}`}>
              {cliente.estado}
            </span>
          </div>
        )}

        {/* Alerta de Cliente de Baja */}
        {estaDeBaja && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-orange-900">Cliente dado de baja</h4>
              <p className="text-sm text-orange-700 mt-1">
                Este cliente está dado de baja. Para poder realizar operaciones con este cliente, debe reactivarlo primero.
              </p>
              {onReactivar && (
                <Button
                  onClick={() => onReactivar(cliente)}
                  disabled={loadingReactivar}
                  className="mt-3 bg-orange-600 hover:bg-orange-700 text-white"
                  size="sm"
                >
                  {loadingReactivar ? 'Reactivando...' : 'Reactivar Cliente'}
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="space-y-6 mt-4">
          {/* Información Personal */}
          <div className="border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
              <User className="h-5 w-5" />
              Información Personal
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="font-medium">
                  {cliente.persona?.nombre || cliente.nombre || 'No especificado'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Apellido</p>
                <p className="font-medium">
                  {cliente.persona?.apellido || cliente.apellido || 'No especificado'}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Hash className="h-3 w-3" /> CUIT
              </p>
              <p className="font-medium font-mono">
                {formatCuit(cliente.persona?.cuit || cliente.cuit)}
              </p>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
              <Mail className="h-5 w-5" />
              Información de Contacto
            </h3>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" /> Email
              </p>
              <p className="font-medium">{cliente.correo || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" /> Teléfono
              </p>
              <p className="font-medium">
                {cliente.persona?.telefono || cliente.telefono || 'No especificado'}
              </p>
            </div>
          </div>

          {/* Información Empresarial */}
          <div className="border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
              <Building className="h-5 w-5" />
              Información Empresarial
            </h3>
            <div>
              <p className="text-sm text-muted-foreground">Razón Social</p>
              <p className="font-medium">{cliente.razonSocial || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tipo de Cliente</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                cliente.tipo === 'Empresa' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {cliente.tipo || 'No especificado'}
              </span>
            </div>
          </div>

          {/* Localidad */}
          {cliente.localidad && (
            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
                <MapPin className="h-5 w-5" />
                Localidad
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Localidad</p>
                  <p className="font-medium">{cliente.localidad.localidad || cliente.localidad.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Provincia</p>
                  <p className="font-medium">{cliente.localidad.provincia}</p>
                </div>
              </div>
              {cliente.localidad.codPostal && (
                <div>
                  <p className="text-sm text-muted-foreground">Código Postal</p>
                  <p className="font-medium">{cliente.localidad.codPostal}</p>
                </div>
              )}
            </div>
          )}

          {/* Observaciones */}
          {cliente.observaciones && (
            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
                <FileText className="h-5 w-5" />
                Observaciones
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {cliente.observaciones}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
