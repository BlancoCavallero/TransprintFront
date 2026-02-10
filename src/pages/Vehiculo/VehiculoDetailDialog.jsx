import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Truck, Calendar, Tag, Activity, Hash, AlertCircle } from 'lucide-react';
import { useDocumentacion } from '../../hooks/entities/useDocumentacion';
import { DocumentacionForm } from '../Documentacion/DocumentacionForm';
import { DocumentacionTable } from '../Documentacion/DocumentacionTable';
import { DocumentacionDetailDialog } from '../Documentacion/DocumentacionDetailDialog';
import { createDocumentacionColumns } from '../Documentacion/DocumentacionTableColumns';
import { DeleteConfirmationDialog } from '@/components/Alert/DeleteConfirmationDialog';
import { toast } from 'sonner';

export const VehiculoDetailDialog = ({ open, onOpenChange, vehiculo, onReactivar, loadingReactivar }) => {
  const [activeTab, setActiveTab] = useState('detalles');
  const [isCreateDocOpen, setIsCreateDocOpen] = useState(false);
  const [isEditDocOpen, setIsEditDocOpen] = useState(false);
  const [isDeleteDocOpen, setIsDeleteDocOpen] = useState(false);
  const [isDetailDocOpen, setIsDetailDocOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const estaDeBaja = vehiculo?.estadoDisponibilidad === 'DE_BAJA';

  const {
    documentaciones,
    loading: loadingDocs,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    handleCreate: handleCreateDoc,
    handleUpdate: handleUpdateDoc,
    handleDelete: handleDeleteDoc,
    refetch: refetchDocs,
  } = useDocumentacion(vehiculo?.idVehiculo || vehiculo?.id, 'VEHICULO');

  useEffect(() => {
    if (open && (vehiculo?.idVehiculo || vehiculo?.id)) {
      refetchDocs();
    }
  }, [open, vehiculo?.idVehiculo, vehiculo?.id, refetchDocs]);

  if (!vehiculo) return null;

  // Estilos compartidos con ChoferDetailDialog
  const getEstadoColor = (estado) => {
    if (!estado) return 'bg-gray-100 text-gray-700 border-gray-200';
    if (estado === 'HABILITADO' || estado === 'Disponible' || estado === 'ACTIVO') return 'bg-green-100 text-green-700 border-green-200';
    if (estado === 'INACTIVO' || estado === 'En mantenimiento') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (estado === 'DE_BAJA') return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getTipoColor = (tipo) => {
    const tipoLower = tipo?.toLowerCase();
    if (tipoLower === 'camion') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (tipoLower === 'acoplado') return 'bg-purple-100 text-purple-700 border-purple-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
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

  // Handlers de lógica intactos
  const handleViewDoc = (doc) => { setSelectedDoc({ ...doc }); setIsDetailDocOpen(true); };
  const handleEditDoc = (doc) => { setSelectedDoc({ ...doc }); setIsEditDocOpen(true); };
  const handleDeleteDocClick = (doc) => { setSelectedDoc({ ...doc }); setIsDeleteDocOpen(true); };

  const handleCreateDocSubmit = async (data) => {
    const result = await handleCreateDoc(data);
    if (result.success) {
      setIsCreateDocOpen(false);
      toast.success('Documentación registrada exitosamente');
    } else {
      toast.error('Error al registrar documentación', { description: result.error });
    }
    return result;
  };

  const handleUpdateDocSubmit = async (data) => {
    if (!selectedDoc) return;
    const result = await handleUpdateDoc(selectedDoc.idDocumentacion || selectedDoc.id, data, selectedDoc);
    if (result.success) {
      setIsEditDocOpen(false);
      setSelectedDoc(null);
      toast.success('Documentación actualizada exitosamente');
    } else {
      toast.error('Error al actualizar documentación', { description: result.error });
    }
    return result;
  };

  const handleDeleteDocConfirm = async () => {
    if (!selectedDoc) return;
    const result = await handleDeleteDoc(selectedDoc.idDocumentacion || selectedDoc.id);
    if (result.success) {
      setIsDeleteDocOpen(false);
      setSelectedDoc(null);
      toast.success('Documentación eliminada exitosamente');
    } else {
      toast.error('Error al eliminar documentación', { description: result.error });
    }
  };

  const docsColumns = createDocumentacionColumns(handleEditDoc, handleDeleteDocClick, handleViewDoc);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent style={{ padding: '30px', maxWidth: '650px' }} className="max-h-[85vh] overflow-y-auto">
          
          <DialogHeader style={{ marginBottom: '10px' }}>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <Truck className="h-6 w-6" style={{ color: '#592673' }} />
              Detalles del Vehículo
            </DialogTitle>
            <DialogDescription className="text-base">
              Especificaciones del vehículo y control de documentación.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="detalles">Detalles</TabsTrigger>
              <TabsTrigger value="documentacion">Documentación ({documentaciones.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="detalles" className="flex flex-column gap-5 mt-0" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Badges de Estado y Tipo */}
              <div className="flex gap-2">
                {vehiculo.estado && (
                  <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold border ${getEstadoColor(vehiculo.estado)}`}>
                    {vehiculo.estado}
                  </span>
                )}
                {vehiculo.tipo && (
                  <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold border ${getTipoColor(vehiculo.tipo)}`}>
                    {vehiculo.tipo === 'CAMION' ? 'Camión' : vehiculo.tipo}
                  </span>
                )}
              </div>

              {/* Alerta de Baja */}
              {estaDeBaja && (
                <div style={{ padding: '18px', backgroundColor: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '12px' }} className="flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-orange-600 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-bold text-orange-900">Vehículo dado de baja</h4>
                    <p className="text-sm text-orange-700 mt-1 leading-relaxed">
                      Esta unidad está inactiva. Debe reactivarla para poder asignarla a nuevos viajes.
                    </p>
                    {onReactivar && (
                      <Button
                        onClick={() => onReactivar(vehiculo)}
                        disabled={loadingReactivar}
                        style={{ marginTop: '12px', backgroundColor: '#ea580c', color: 'white' }}
                        size="sm"
                      >
                        {loadingReactivar ? 'Reactivando...' : 'Reactivar Vehículo'}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Información de Identificación */}
              <div style={cardStyle}>
                <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: '#592673' }}>
                  <Tag className="h-4 w-4" /> Identificación y Registro
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Patente</p>
                    <p className="font-bold text-lg text-slate-900 tracking-wider uppercase">{vehiculo.patente || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-1">
                       <Calendar className="h-3 w-3" /> Año
                    </p>
                    <p className="font-medium text-slate-900">{vehiculo.anio || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Información de Marca y Modelo */}
              <div style={cardStyle}>
                <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: '#592673' }}>
                  <Truck className="h-4 w-4" /> Especificaciones
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Marca</p>
                    <p className="font-medium text-slate-900">{vehiculo.marca || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Modelo</p>
                    <p className="font-medium text-slate-900">{vehiculo.modelo || '—'}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documentacion" className="space-y-4 mt-0">
              {estaDeBaja ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4 bg-slate-50 rounded-xl border border-dashed">
                  <AlertCircle className="h-12 w-12 text-orange-500" />
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold text-slate-900">Gestión no disponible</h3>
                    <p className="text-sm text-slate-500 max-w-xs">
                      Debe reactivar el vehículo para gestionar su documentación.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                      Lista de Documentos
                    </h3>
                    <Button 
                      onClick={() => setIsCreateDocOpen(true)} 
                      size="sm"
                      style={{ backgroundColor: '#592673', color: 'white' }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Nuevo Documento
                    </Button>
                  </div>

                  {loadingDocs ? (
                    <div className="flex items-center justify-center h-32">
                      <p className="text-sm text-slate-500 italic">Cargando documentación...</p>
                    </div>
                  ) : (
                    <div className="border rounded-xl overflow-hidden">
                      <DocumentacionTable columns={docsColumns} data={documentaciones} />
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Diálogos secundarios */}
      <DocumentacionForm
        open={isCreateDocOpen}
        onOpenChange={setIsCreateDocOpen}
        onSubmit={handleCreateDocSubmit}
        isLoading={loadingCreate}
        mode="create"
        tipoEntidad="VEHICULO"
        idEntidad={vehiculo?.idVehiculo || vehiculo?.id}
      />
      <DocumentacionForm
        open={isEditDocOpen}
        onOpenChange={setIsEditDocOpen}
        onSubmit={handleUpdateDocSubmit}
        defaultValues={selectedDoc}
        isLoading={loadingUpdate}
        mode="edit"
        tipoEntidad="VEHICULO"
        idEntidad={vehiculo?.idVehiculo || vehiculo?.id}
      />
      <DocumentacionDetailDialog
        open={isDetailDocOpen}
        onOpenChange={setIsDetailDocOpen}
        documentacion={selectedDoc}
      />
      <DeleteConfirmationDialog
        open={isDeleteDocOpen}
        onOpenChange={setIsDeleteDocOpen}
        onConfirm={handleDeleteDocConfirm}
        isLoading={loadingDelete}
        description={`¿Estás seguro de eliminar la documentación "${selectedDoc?.nombre}"?`}
      />
    </>
  );
};