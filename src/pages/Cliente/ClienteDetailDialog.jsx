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
        return 'bg-green-100 text-green-700 border-green-200';
      case 'DE_BAJA':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
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

  // Constante para unificar el estilo de las tarjetas internas
  const cardStyle = {
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Ajustamos maxWidth a 550px y padding a 30px como el Form */}
      <DialogContent style={{ padding: '30px', maxWidth: '550px' }} className="max-h-[85vh] overflow-y-auto">
        
        <DialogHeader style={{ marginBottom: '20px' }}>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <User className="h-6 w-6" style={{ color: '#592673' }} />
            Detalles del Cliente
          </DialogTitle>
          <DialogDescription className="text-base">
            Información completa y estado actual en el sistema.
          </DialogDescription>
        </DialogHeader>

        {/* Estado Badge - Con un poco más de margen */}
        {cliente.estado && (
          <div style={{ marginBottom: '20px' }}>
            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold border ${getEstadoColor(cliente.estado)}`}>
              {cliente.estado}
            </span>
          </div>
        )}

        {/* Alerta de Cliente de Baja */}
        {estaDeBaja && (
          <div style={{ marginBottom: '25px', padding: '18px', backgroundColor: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '12px' }} className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-orange-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-bold text-orange-900">Cliente dado de baja</h4>
              <p className="text-sm text-orange-700 mt-1 leading-relaxed">
                Este cliente está inactivo. Debe reactivarlo para poder realizar nuevas operaciones.
              </p>
              {onReactivar && (
                <Button
                  onClick={() => onReactivar(cliente)}
                  disabled={loadingReactivar}
                  style={{ marginTop: '12px', backgroundColor: '#ea580c', color: 'white' }}
                  size="sm"
                >
                  {loadingReactivar ? 'Reactivando...' : 'Reactivar Cliente'}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Contenedor principal con Gaps generosos como el form anterior */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Información Personal */}
          <div style={cardStyle}>
            <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: '#592673' }}>
              <User className="h-4 w-4" /> Información Personal
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Nombre</p>
                <p className="font-medium text-slate-900">{cliente.persona?.nombre || cliente.nombre || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Apellido</p>
                <p className="font-medium text-slate-900">{cliente.persona?.apellido || cliente.apellido || '—'}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-1">
                <Hash className="h-3 w-3" /> CUIT
              </p>
              <p className="font-medium font-mono text-slate-900">{formatCuit(cliente.persona?.cuit || cliente.cuit)}</p>
            </div>
          </div>

          {/* Información de Contacto */}
          <div style={cardStyle}>
            <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: '#592673' }}>
              <Mail className="h-4 w-4" /> Contacto
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Email</p>
                <p className="font-medium text-slate-900">{cliente.correo || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Teléfono</p>
                <p className="font-medium text-slate-900">{cliente.persona?.telefono || cliente.telefono || '—'}</p>
              </div>
            </div>
          </div>

          {/* Información Empresarial */}
          <div style={cardStyle}>
            <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: '#592673' }}>
              <Building className="h-4 w-4" /> Empresa
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Razón Social</p>
                <p className="font-medium text-slate-900">{cliente.razonSocial || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Tipo</p>
                <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold ${
                  cliente.tipo === 'Empresa' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-green-50 text-green-700 border border-green-100'
                }`}>
                  {cliente.tipo || 'No especificado'}
                </span>
              </div>
            </div>
          </div>

          {/* Localidad */}
          {cliente.localidad && (
            <div style={cardStyle}>
              <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: '#592673' }}>
                <MapPin className="h-4 w-4" /> Ubicación
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Localidad</p>
                  <p className="font-medium text-slate-900">{cliente.localidad.localidad || cliente.localidad.nombre}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Provincia</p>
                  <p className="font-medium text-slate-900">{cliente.localidad.provincia}</p>
                </div>
              </div>
            </div>
          )}

          {/* Observaciones */}
          {cliente.observaciones && (
            <div style={{ ...cardStyle, backgroundColor: '#f8fafc' }}>
              <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2 text-slate-600">
                <FileText className="h-4 w-4" /> Observaciones
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed italic">
                "{cliente.observaciones}"
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};