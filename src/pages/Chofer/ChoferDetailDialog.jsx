import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { User, Phone, FileText, Hash, AlertCircle } from 'lucide-react';

export const ChoferDetailDialog = ({ open, onOpenChange, chofer }) => {
  if (!chofer) return null;

  const formatCuit = (cuit) => {
    if (!cuit) return 'No especificado';
    const cuitStr = String(cuit);
    if (cuitStr.length === 11) {
      return `${cuitStr.slice(0, 2)}-${cuitStr.slice(2, 10)}-${cuitStr.slice(10)}`;
    }
    return cuitStr;
  };

  const getEstadoColor = (estado) => {
    if (!estado) return 'bg-gray-100 text-gray-700';
    if (estado === 'Disponible') return 'bg-green-100 text-green-700';
    if (estado === 'Inhabilitado') return 'bg-red-100 text-red-700';
    if (estado === 'En viaje') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            Detalles del Chofer
          </DialogTitle>
          <DialogDescription>
            Información completa del chofer
          </DialogDescription>
        </DialogHeader>

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
                  {chofer.persona?.nombre || chofer.nombre || 'No especificado'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Apellido</p>
                <p className="font-medium">
                  {chofer.persona?.apellido || chofer.apellido || 'No especificado'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3 w-3" /> DNI
                </p>
                <p className="font-medium font-mono">{chofer.dni || 'No especificado'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3 w-3" /> CUIT
                </p>
                <p className="font-medium font-mono">
                  {formatCuit(chofer.persona?.cuit || chofer.cuit)}
                </p>
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
              <Phone className="h-5 w-5" />
              Información de Contacto
            </h3>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" /> Teléfono
              </p>
              <p className="font-medium">
                {chofer.persona?.telefono || chofer.telefono || 'No especificado'}
              </p>
            </div>
          </div>

          {/* Estado de Disponibilidad */}
          <div className="border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
              <AlertCircle className="h-5 w-5" />
              Estado de Disponibilidad
            </h3>
            <div>
              <span className={`inline-block px-3 py-2 rounded-full text-sm font-medium ${
                getEstadoColor(chofer.estadoDisponibilidad)
              }`}>
                {chofer.estadoDisponibilidad || 'No especificado'}
              </span>
            </div>
          </div>

          {/* Información del Sistema */}
          <div className="border rounded-lg p-4 space-y-3 bg-muted/50">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Información del Sistema
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">ID Chofer</p>
                <p className="font-medium font-mono">{chofer.idChofer || chofer.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">ID Persona</p>
                <p className="font-medium font-mono">{chofer.idPersona || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
