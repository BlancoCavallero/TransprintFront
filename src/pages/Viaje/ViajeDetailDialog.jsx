import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  MapPin, 
  Calendar, 
  User, 
  Truck, 
  Navigation, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ViajeDetailDialog = ({ open, onOpenChange, viaje }) => {
  if (!viaje) return null;

  const esCancelado = viaje.estado === 'CANCELADO';

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'PENDIENTE': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'EN_CURSO': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'FINALIZADO': return 'bg-green-100 text-green-700 border-green-200';
      case 'CANCELADO': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const cardStyle = {
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ padding: '24px', maxWidth: '500px' }} className="max-h-[90vh] overflow-y-auto border-none">
        
        <DialogHeader style={{ marginBottom: '16px' }}>
          <DialogTitle className="text-xl font-bold flex items-center gap-3">
            <Navigation className="h-5 w-5" style={{ color: '#592673' }} />
            Detalles del Viaje
          </DialogTitle>
          <DialogDescription className="text-sm">
            Resumen de la operación logística.
          </DialogDescription>
        </DialogHeader>

        {viaje.estado && (
          <div style={{ marginBottom: '16px' }}>
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold border ${getEstadoColor(viaje.estado)}`}>
              {viaje.estado}
            </span>
          </div>
        )}

        {esCancelado && (
          <div style={{ marginBottom: '20px', padding: '14px', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px' }} className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-red-900">Viaje Cancelado</h4>
              <p className="text-xs text-red-700 mt-1 leading-relaxed">
                {viaje.motivoCancelacion || 'Sin motivo especificado'}
              </p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Personal */}
          <div style={cardStyle}>
            <h3 className="font-bold text-[11px] uppercase tracking-wider flex items-center gap-2" style={{ color: '#592673' }}>
              <User className="h-3.5 w-3.5" /> Asignación
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Cliente</p>
                <p className="text-sm font-medium text-slate-900 truncate">
                  {viaje.cliente?.razonSocial || `${viaje.cliente?.persona?.nombre} ${viaje.cliente?.persona?.apellido}` || '—'}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Chofer</p>
                <p className="text-sm font-medium text-slate-900 truncate">
                  {viaje.chofer?.persona?.nombre} {viaje.chofer?.persona?.apellido || '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Vehículo y Ruta (Datos completados) */}
          <div style={cardStyle}>
            <div className="flex justify-between items-start border-b pb-2 mb-1 border-slate-50">
               <div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1 mb-1">
                    <Truck className="h-3 w-3" /> Vehículo
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {viaje.vehiculo?.patente || 'S/D'} 
                    <span className="font-normal text-slate-500"> - {viaje.vehiculo?.marca} {viaje.vehiculo?.modelo}</span>
                  </p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-semibold uppercase mb-1">Distancia</p>
                  <p className="text-sm font-bold text-slate-900">{viaje.kilometros || 0} km</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-1">
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1"><MapPin className="h-2.5 w-2.5"/> Origen</p>
                <p className="text-xs font-medium text-slate-700 italic truncate">
                    {viaje.localidadOrigen?.localidad}, {viaje.localidadOrigen?.provincia}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1"><MapPin className="h-2.5 w-2.5"/> Destino</p>
                <p className="text-xs font-medium text-slate-700 italic truncate">
                    {viaje.localidadDestino?.localidad}, {viaje.localidadDestino?.provincia}
                </p>
              </div>
            </div>
          </div>

          {/* Fechas y Precio */}
          <div style={{ ...cardStyle, backgroundColor: '#f8fafc' }}>
            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-600">
                  <Calendar className="h-3 w-3" /> {formatDate(viaje.fechaInicio)}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-600">
                  <Clock className="h-3 w-3" /> {formatDate(viaje.fechaFin)}
                </div>
              </div>
              <div className="text-right border-l border-slate-200 pl-4">
                <p className="text-[10px] text-slate-500 font-semibold uppercase mb-1">Importe</p>
                <p className="text-lg font-bold text-[#592673]">
                  ${Number(viaje.precio).toLocaleString('es-AR')}
                </p>
              </div>
            </div>
          </div>

          {viaje.observaciones && (
            <div className="px-1">
              <p className="text-[10px] text-slate-400 font-semibold uppercase mb-1">Observaciones</p>
              <p className="text-xs text-slate-600 italic leading-snug">"{viaje.observaciones}"</p>
            </div>
          )}
        </div>

        {/* Botón de cerrar ajustado */}
        <div className="mt-8 flex justify-end">
          <Button 
            onClick={() => onOpenChange(false)}
            className="rounded-md font-bold text-xs uppercase tracking-widest shadow-md transition-all hover:opacity-90"
            style={{ 
              backgroundColor: '#592673', 
              color: 'white',
              paddingLeft: '40px',
              paddingRight: '40px',
              height: '40px'
            }}
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};