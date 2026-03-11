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

  // Colores consistentes con el resto de la app
  const getTipoMantenimientoColor = (tipo) => {
    if (!tipo) return 'bg-gray-100 text-gray-700 border-gray-200';
    const tipoLower = tipo.toLowerCase();
    if (tipoLower === 'preventivo') return 'bg-green-100 text-green-700 border-green-200';
    if (tipoLower === 'correctivo') return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getTipoVehiculoColor = (tipo) => {
    if (!tipo) return 'bg-gray-100 text-gray-700 border-gray-200';
    const tipoLower = tipo.toLowerCase();
    if (tipoLower === 'ligero') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (tipoLower === 'mediano') return 'bg-purple-100 text-purple-700 border-purple-200';
    if (tipoLower === 'pesado') return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    if (tipoLower === 'terapesado') return 'bg-teal-100 text-teal-700 border-teal-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getTipoVehiculoLabel = (tipo) => {
    if (!tipo) return 'Sin tipo';
    const tipoLower = tipo.toLowerCase();
    if (tipoLower === 'ligero') return 'Ligero';
    if (tipoLower === 'mediano') return 'Mediano';
    if (tipoLower === 'pesado') return 'Pesado';
    if (tipoLower === 'terapesado') return 'Terapesado';
    return tipo;
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
            <Wrench className="h-6 w-6" style={{ color: '#592673' }} />
            Detalles del Mantenimiento
          </DialogTitle>
          <DialogDescription className="text-base">
            Registro técnico de intervenciones y estado del vehículo.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 mt-4">
          
          {/* Badge de Tipo de Mantenimiento destacado */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tipo de Servicio</span>
              <span className={`inline-flex items-center px-3 py-1 mt-1 rounded-full text-xs font-bold border ${getTipoMantenimientoColor(mantenimiento.tipo)}`}>
                {mantenimiento.tipo || 'Sin tipo'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Código Registro</span>
              <div className="flex items-center justify-end gap-1 text-sm font-mono font-bold text-slate-600">
                <Hash className="h-4 w-4 text-slate-400" />
                {mantenimiento.idMantenimiento || '—'}
              </div>
            </div>
          </div>

          {/* Fechas del Servicio */}
          <div style={cardStyle}>
            <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: '#592673' }}>
              <Calendar className="h-4 w-4" /> Cronograma de Trabajo
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Fecha Inicio</p>
                <p className="font-medium text-slate-900">{mantenimiento.fechaInicio || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Fecha Fin estimada</p>
                <p className="font-medium text-slate-900">{mantenimiento.fechaFin || '—'}</p>
              </div>
            </div>
          </div>

          {/* Información del Vehículo en Mantenimiento */}
          {mantenimiento.vehiculo && (
            <div style={cardStyle}>
              <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: '#592673' }}>
                <Truck className="h-4 w-4" /> Unidad en Taller
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-slate-500 font-semibold uppercase">Vehículo</p>
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 px-2 py-1 rounded font-mono font-bold text-sm border text-slate-700">
                      {mantenimiento.vehiculo.patente || '—'}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getTipoVehiculoColor(mantenimiento.vehiculo.tipo)}`}>
                      {getTipoVehiculoLabel(mantenimiento.vehiculo.tipo)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Marca / Modelo</p>
                  <p className="text-sm font-medium text-slate-900">
                    {mantenimiento.vehiculo.marca} {mantenimiento.vehiculo.modelo}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Observaciones Técnicas */}
          {mantenimiento.observaciones && (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                <FileText className="h-3 w-3" /> Observaciones Técnicas
              </p>
              <p className="text-sm text-slate-600 leading-relaxed italic">
                "{mantenimiento.observaciones}"
              </p>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
};