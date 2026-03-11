import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DollarSign, FileText, Hash, MapPin, Activity, Tag, Receipt, Truck, User } from 'lucide-react';

export const GastoDetailDialog = ({ open, onOpenChange, gasto }) => {
  if (!gasto) return null;

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'Combustible':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Peaje':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Viatico':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getEstadoColor = (estado) => {
    if (!estado) return 'bg-gray-100 text-gray-700 border-gray-200';
    const estadoUpper = estado.toUpperCase();
    switch (estadoUpper) {
      case 'PROGRAMADO': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'EN_CURSO':
      case 'EN CURSO': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'FINALIZADO': return 'bg-green-100 text-green-700 border-green-200';
      case 'CANCELADO': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

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
      <DialogContent style={{ padding: '30px', maxWidth: '650px' }} className="max-h-[85vh] overflow-y-auto">
        
        <DialogHeader style={{ marginBottom: '10px' }}>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <Receipt className="h-6 w-6" style={{ color: '#592673' }} />
            Detalles del Gasto
          </DialogTitle>
          <DialogDescription className="text-base">
            Desglose de costos operativos y comprobantes asociados.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 mt-4">
          
          {/* Header de Monto y Tipo */}
          <div className="flex items-center justify-between bg-slate-50 p-5 rounded-xl border border-slate-100">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Categoría</span>
              <span className={`inline-flex items-center px-3 py-1 mt-1 rounded-full text-xs font-bold border ${getTipoColor(gasto.tipo)}`}>
                {gasto.tipo || 'Sin tipo'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Importe Total</span>
              <div className="flex items-center justify-end gap-1 text-2xl font-black text-slate-900">
                <DollarSign className="h-6 w-6 text-green-600" />
                {gasto.monto?.toLocaleString('es-ES') || 0}
              </div>
            </div>
          </div>

          {/* Detalles del Gasto */}
          <div style={cardStyle}>
            <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: '#592673' }}>
              <FileText className="h-4 w-4" /> Descripción del Comprobante
            </h3>
            <div className="bg-slate-50 p-4 rounded-lg border border-dashed border-slate-300">
              <p className="text-sm text-slate-600 leading-relaxed italic">
                {gasto.detalle || 'Sin descripción adicional disponible.'}
              </p>
            </div>
          </div>

          {/* Información del Viaje Vinculado */}
          {gasto.viaje && (
            <div style={cardStyle}>
              <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: '#592673' }}>
                <MapPin className="h-4 w-4" /> Viaje Asociado
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Estado del Viaje</p>
                    <span className={`inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-[10px] font-bold border ${getEstadoColor(gasto.viaje.estado)}`}>
                      {gasto.viaje.estado || '—'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-1">
                      <User className="h-3 w-3" /> Chofer
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {gasto.viaje.chofer?.persona?.nombre} {gasto.viaje.chofer?.persona?.apellido}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Recorrido</p>
                    <p className="text-sm font-bold text-slate-900">{gasto.viaje.kilometros || 0} KM</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-1">
                      <Truck className="h-3 w-3" /> Unidad
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-[11px] border text-slate-700">
                        {gasto.viaje.vehiculo?.patente || '—'}
                      </span>
                      <p className="text-[11px] font-medium text-slate-600 truncate">
                        {gasto.viaje.vehiculo?.marca}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notas del Viaje */}
              {gasto.viaje.observaciones && (
                <div className="mt-2 pt-3 border-t border-slate-100">
                  <p className="text-[11px] text-slate-400 font-bold uppercase mb-1">Notas de Logística</p>
                  <p className="text-xs text-slate-500 italic">{gasto.viaje.observaciones}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};