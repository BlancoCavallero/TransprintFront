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
import { Plus } from 'lucide-react';
import { Truck, Calendar, Tag, Activity, Hash } from 'lucide-react';
import { useDocumentacion } from '../../hooks/entities/useDocumentacion';
import { DocumentacionForm } from '../Documentacion/DocumentacionForm';
import { DocumentacionTable } from '../Documentacion/DocumentacionTable';
import { DocumentacionDetailDialog } from '../Documentacion/DocumentacionDetailDialog';
import { createDocumentacionColumns } from '../Documentacion/DocumentacionTableColumns';
import { DeleteConfirmationDialog } from '@/components/Alert/DeleteConfirmationDialog';
import { toast } from 'sonner';

export const VehiculoDetailDialog = ({ open, onOpenChange, vehiculo }) => {
  const [activeTab, setActiveTab] = useState('detalles');
  const [isCreateDocOpen, setIsCreateDocOpen] = useState(false);
  const [isEditDocOpen, setIsEditDocOpen] = useState(false);
  const [isDeleteDocOpen, setIsDeleteDocOpen] = useState(false);
  const [isDetailDocOpen, setIsDetailDocOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

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

  // Refrescar documentaciones cuando cambia el vehículo
  useEffect(() => {
    if (open && (vehiculo?.idVehiculo || vehiculo?.id)) {
      refetchDocs();
    }
  }, [open, vehiculo?.idVehiculo, vehiculo?.id, refetchDocs]);

  if (!vehiculo) return null;

  const getEstadoColor = (estado) => {
    if (!estado) return 'bg-gray-100 text-gray-700';
    const estadoLower = estado.toLowerCase();
    if (estadoLower === 'activo') return 'bg-green-100 text-green-700';
    if (estadoLower === 'inactivo') return 'bg-red-100 text-red-700';
    if (estadoLower === 'en mantenimiento') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getTipoColor = (tipo) => {
    if (!tipo) return 'bg-gray-100 text-gray-700';
    const tipoLower = tipo.toLowerCase();
    if (tipoLower === 'camion') return 'bg-blue-100 text-blue-700';
    if (tipoLower === 'acoplado') return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getTipoLabel = (tipo) => {
    if (!tipo) return 'Sin tipo';
    const tipoLower = tipo.toLowerCase();
    if (tipoLower === 'camion') return 'Camión';
    if (tipoLower === 'acoplado') return 'Acoplado';
    return tipo;
  };

  const handleViewDoc = (doc) => {
    setSelectedDoc({ ...doc });
    setIsDetailDocOpen(true);
  };

  const handleEditDoc = (doc) => {
    setSelectedDoc({ ...doc });
    setIsEditDocOpen(true);
  };

  const handleDeleteDocClick = (doc) => {
    setSelectedDoc({ ...doc });
    setIsDeleteDocOpen(true);
  };

  const handleCreateDocSubmit = async (data) => {
    const result = await handleCreateDoc(data);
    if (result.success) {
      setIsCreateDocOpen(false);
      toast.success('Documentación registrada exitosamente', {
        description: `La documentación de tipo "${data.tipo}" ha sido agregada al vehículo.`
      });
    } else {
      toast.error('Error al registrar documentación', {
        description: result.error || 'Ocurrió un error al intentar registrar la documentación.'
      });
    }
    return result;
  };

  const handleUpdateDocSubmit = async (data) => {
    if (!selectedDoc) return;
    const result = await handleUpdateDoc(
      selectedDoc.idDocumentacion || selectedDoc.id,
      data,
      selectedDoc
    );
    if (result.success) {
      setIsEditDocOpen(false);
      setSelectedDoc(null);
      toast.success('Documentación actualizada exitosamente', {
        description: 'Los datos de la documentación han sido actualizados.'
      });
    } else {
      toast.error('Error al actualizar documentación', {
        description: result.error || 'Ocurrió un error al intentar actualizar la documentación.'
      });
    }
    return result;
  };

  const handleDeleteDocConfirm = async () => {
    if (!selectedDoc) return;
    const result = await handleDeleteDoc(selectedDoc.idDocumentacion || selectedDoc.id);
    if (result.success) {
      setIsDeleteDocOpen(false);
      setSelectedDoc(null);
      toast.success('Documentación eliminada exitosamente', {
        description: 'La documentación ha sido eliminada del vehículo.'
      });
    } else {
      toast.error('Error al eliminar documentación', {
        description: result.error || 'Ocurrió un error al intentar eliminar la documentación.'
      });
    }
  };

  const docsColumns = createDocumentacionColumns(
    handleEditDoc,
    handleDeleteDocClick,
    handleViewDoc
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Detalles del Vehículo
            </DialogTitle>
            <DialogDescription>
              Información completa del vehículo y gestión de documentación
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="detalles">Detalles del Vehículo</TabsTrigger>
              <TabsTrigger value="documentacion">Documentación ({documentaciones.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="detalles" className="space-y-6 mt-4">
          {/* Información del Vehículo */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Información del Vehículo</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Patente</p>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <p className="text-sm font-medium">{vehiculo.patente || 'Sin patente'}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500">Marca</p>
                <p className="text-sm font-medium">{vehiculo.marca || 'Sin marca'}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500">Modelo</p>
                <p className="text-sm font-medium">{vehiculo.modelo || 'Sin modelo'}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500">Año</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-sm font-medium">{vehiculo.anio || 'Sin año'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Estado y Tipo */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Estado y Tipo</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Estado</p>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-gray-400" />
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(vehiculo.estado)}`}>
                    {vehiculo.estado || 'Sin estado'}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500">Tipo</p>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-gray-400" />
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTipoColor(vehiculo.tipo)}`}>
                    {getTipoLabel(vehiculo.tipo)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Información del Sistema */}
          <div className="space-y-3 pt-3 border-t">
            <h3 className="text-sm font-semibold text-gray-900">Información del Sistema</h3>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">ID del Vehículo</p>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-400" />
                <p className="text-sm font-mono">{vehiculo.idVehiculo || 'Sin ID'}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documentacion" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Documentación del Vehículo ({documentaciones.length})
            </h3>
            <Button onClick={() => setIsCreateDocOpen(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Registrar Documentación
            </Button>
          </div>

          {loadingDocs ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-sm text-gray-500">Cargando documentación...</p>
            </div>
          ) : (
            <DocumentacionTable columns={docsColumns} data={documentaciones} />
          )}
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>

  {/* Diálogos de Documentación */}
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
    description={`¿Estás seguro de eliminar la documentación "${selectedDoc?.nombre}"? Esta acción no se puede deshacer.`}
  />
</>
  );
};
