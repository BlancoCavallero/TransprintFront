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

  // Estilos de estado consistentes
  const getEstadoColor = (estado) => {
    if (!estado) return 'bg-gray-100 text-gray-700 border-gray-200';
    const estadoLower = estado.toLowerCase();
    if (estadoLower === 'vigente') return 'bg-green-100 text-green-700 border-green-200';
    if (estadoLower === 'vencida') return 'bg-red-100 text-red-700 border-red-200';
    if (estadoLower === 'por vencer') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  // Estilo de tarjeta copiado de ChoferDetailDialog
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
      {/* Ajustamos padding y ancho consistente con los demás diálogos de detalle */}
      <DialogContent style={{ padding: '30px', maxWidth: '550px' }} className="max-h-[85vh] overflow-y-auto">
        
        <DialogHeader style={{ marginBottom: '10px' }}>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <FileText className="h-6 w-6" style={{ color: '#592673' }} />
            Detalles de Documentación
          </DialogTitle>
          <DialogDescription className="text-base">
            Información técnica y estado de vigencia del documento.
          </DialogDescription>
        </DialogHeader>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Badge de Estado Principal */}
          <div>
            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold border ${getEstadoColor(documentacion.estado)}`}>
              {documentacion.estado || 'SIN ESTADO'}
            </span>
          </div>

          {/* Card: Información del Documento */}
          <div style={cardStyle}>
            <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: '#592673' }}>
              <FileText className="h-4 w-4" /> Datos del Registro
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Tipo de Documento</p>
                <p className="font-medium text-slate-900 text-lg">{documentacion.nombre || '—'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-2">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Vencimiento
                </p>
                <p className="font-medium text-slate-900">{documentacion.fechaVencimiento || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-1">
                  <Activity className="h-3 w-3" /> Renovación
                </p>
                <p className="font-medium text-slate-900">
                  {documentacion.renovacion ? `${documentacion.renovacion} meses` : 'No aplica'}
                </p>
              </div>
            </div>
          </div>

          {/* Card: Entidad Asociada (Dinámica para Chofer o Vehículo) */}
          {(documentacion.chofer || documentacion.vehiculo) && (
            <div style={cardStyle}>
              <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: '#592673' }}>
                {documentacion.tipoEntidad === 'CHOFER' ? <User className="h-4 w-4" /> : <Truck className="h-4 w-4" />}
                Asociado a {documentacion.tipoEntidad === 'CHOFER' ? 'Chofer' : 'Vehículo'}
              </h3>

              {documentacion.tipoEntidad === 'CHOFER' && documentacion.chofer && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Nombre Completo</p>
                    <p className="font-medium text-slate-900">
                      {documentacion.chofer.persona
                        ? `${documentacion.chofer.persona.nombre} ${documentacion.chofer.persona.apellido}`
                        : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-1">
                      <Hash className="h-3 w-3" /> DNI
                    </p>
                    <p className="font-medium font-mono text-slate-900">{documentacion.chofer.dni || '—'}</p>
                  </div>
                </div>
              )}

              {documentacion.tipoEntidad === 'VEHICULO' && documentacion.vehiculo && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-1">
                      <Tag className="h-3 w-3" /> Patente
                    </p>
                    <p className="font-medium font-mono text-slate-900 uppercase">
                      {documentacion.vehiculo.patente || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Vehículo</p>
                    <p className="font-medium text-slate-900">
                      {documentacion.vehiculo.marca} {documentacion.vehiculo.modelo}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Información Técnica del ID (Sutil al final) */}
          <div className="px-1 flex justify-between items-center opacity-50">
             <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">
               ID-DOC: {documentacion.idDocumentacion || 'N/A'}
             </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};