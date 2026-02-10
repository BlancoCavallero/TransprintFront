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
import { Plus, User, Phone, FileText, Hash, AlertCircle } from 'lucide-react';
import { useDocumentacion } from '../../hooks/entities/useDocumentacion';
import { DocumentacionForm } from '../Documentacion/DocumentacionForm';
import { DocumentacionTable } from '../Documentacion/DocumentacionTable';
import { DocumentacionDetailDialog } from '../Documentacion/DocumentacionDetailDialog';
import { createDocumentacionColumns } from '../Documentacion/DocumentacionTableColumns';
import { DeleteConfirmationDialog } from '@/components/Alert/DeleteConfirmationDialog';
import { toast } from 'sonner';

export const ChoferDetailDialog = ({ open, onOpenChange, chofer, onReactivar, loadingReactivar }) => {
  const [activeTab, setActiveTab] = useState('detalles');
  const [isCreateDocOpen, setIsCreateDocOpen] = useState(false);
  const [isEditDocOpen, setIsEditDocOpen] = useState(false);
  const [isDeleteDocOpen, setIsDeleteDocOpen] = useState(false);
  const [isDetailDocOpen, setIsDetailDocOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const estaDeBaja = chofer?.estadoDisponibilidad === 'DE_BAJA';

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
  } = useDocumentacion(chofer?.idChofer || chofer?.id, 'CHOFER');

  useEffect(() => {
    if (open && (chofer?.idChofer || chofer?.id)) {
      refetchDocs();
    }
  }, [open, chofer?.idChofer, chofer?.id, refetchDocs]);

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
    if (!estado) return 'bg-gray-100 text-gray-700 border-gray-200';
    if (estado === 'HABILITADO' || estado === 'Disponible') return 'bg-green-100 text-green-700 border-green-200';
    if (estado === 'INHABILITADO' || estado === 'Inhabilitado') return 'bg-red-100 text-red-700 border-red-200';
    if (estado === 'OCUPADO' || estado === 'En viaje') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (estado === 'DE_BAJA') return 'bg-orange-100 text-orange-700 border-orange-200';
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

  // Handlers de Documentación (Lógica intacta)
  const handleViewDoc = (doc) => { setSelectedDoc({ ...doc }); setIsDetailDocOpen(true); };
  const handleEditDoc = (doc) => { setSelectedDoc({ ...doc }); setIsEditDocOpen(true); };
  const handleDeleteDocClick = (doc) => { setSelectedDoc({ ...doc }); setIsDeleteDocOpen(true); };

  const handleCreateDocSubmit = async (data) => {
    const result = await handleCreateDoc(data);
    console.log("Create doc result:", result);
    if (result.success) {
      setIsCreateDocOpen(false);
      toast.success('Documentación registrada exitosamente', {
        description: `La documentación sido agregada al chofer.`
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
    const result = await handleUpdateDoc(selectedDoc.idDocumentacion || selectedDoc.id, data, selectedDoc);
    if (result.success) {
      setIsEditDocOpen(false);
      setSelectedDoc(null);
      toast.success('Documentación actualizada exitosamente');
    }
    return result;
  };

  const handleDeleteDocConfirm = async () => {
    if (!selectedDoc) return;
    const result = await handleDeleteDoc(selectedDoc.idDocumentacion || selectedDoc.id);
    if (result.success) {
      setIsDeleteDocOpen(false);
      setSelectedDoc(null);
      toast.success('Documentación eliminada');
    }
  };

  const docsColumns = createDocumentacionColumns(handleEditDoc, handleDeleteDocClick, handleViewDoc);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent style={{ padding: '30px', maxWidth: '850px' }} className="max-h-[90vh] overflow-y-auto">
          <DialogHeader style={{ marginBottom: '10px' }}>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <User className="h-6 w-6" style={{ color: '#592673' }} />
              Detalles del Chofer
            </DialogTitle>
            <DialogDescription className="text-base">
              Información completa y gestión de documentación del chofer.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6" style={{ backgroundColor: '#f1f5f9' }}>
              <TabsTrigger value="detalles">Información General</TabsTrigger>
              <TabsTrigger value="documentacion">Documentación ({documentaciones.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="detalles" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Badge de Estado */}
              <div>
                <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold border ${getEstadoColor(chofer.estadoDisponibilidad)}`}>
                  {chofer.estadoDisponibilidad || 'No especificado'}
                </span>
              </div>

              {/* Alerta de Baja (Mismo estilo que Cliente) */}
              {estaDeBaja && (
                <div style={{ padding: '18px', backgroundColor: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '12px' }} className="flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-orange-600 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-bold text-orange-900">Chofer dado de baja</h4>
                    <p className="text-sm text-orange-700 mt-1 leading-relaxed">
                      Este chofer está inactivo. No se puede gestionar documentación hasta que sea reactivado.
                    </p>
                    <Button
                      onClick={() => onReactivar?.(chofer)}
                      disabled={loadingReactivar}
                      style={{ marginTop: '12px', backgroundColor: '#ea580c', color: 'white' }}
                      size="sm"
                    >
                      {loadingReactivar ? 'Reactivando...' : 'Reactivar Chofer'}
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Información Personal */}
                <div style={cardStyle}>
                  <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: '#592673' }}>
                    <User className="h-4 w-4" /> Datos Personales
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase">Nombre Completo</p>
                      <p className="font-medium text-slate-900">{chofer.persona?.nombre || chofer.nombre} {chofer.persona?.apellido || chofer.apellido}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase">DNI</p>
                        <p className="font-medium font-mono text-slate-900">{chofer.dni || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase">CUIT</p>
                        <p className="font-medium font-mono text-slate-900">{formatCuit(chofer.persona?.cuit || chofer.cuit)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contacto y Sistema */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={cardStyle}>
                    <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: '#592673' }}>
                      <Phone className="h-4 w-4" /> Contacto
                    </h3>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase">Teléfono</p>
                      <p className="font-medium text-slate-900">{chofer.persona?.telefono || chofer.telefono || '—'}</p>
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
          {/* <div className="border rounded-lg p-4 space-y-3 bg-muted/50">
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
          </div> */}
        </TabsContent>

            <TabsContent value="documentacion" className="mt-4">
              <div style={{ ...cardStyle, minHeight: '300px' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">Documentación Registrada</h3>
                  {!estaDeBaja && (
                    <Button 
                      onClick={() => setIsCreateDocOpen(true)} 
                      style={{ backgroundColor: '#592673', color: 'white' }}
                      size="sm"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Nuevo Documento
                    </Button>
                  )}
                </div>

                {loadingDocs ? (
                  <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                    <AlertCircle className="h-8 w-8 animate-pulse mb-2" />
                    <p className="text-sm">Cargando legajo...</p>
                  </div>
                ) : (
                  <DocumentacionTable columns={docsColumns} data={documentaciones} />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Diálogos Secundarios (Lógica intacta) */}
      <DocumentacionForm
        open={isCreateDocOpen}
        onOpenChange={setIsCreateDocOpen}
        onSubmit={handleCreateDocSubmit}
        isLoading={loadingCreate}
        mode="create"
        tipoEntidad="CHOFER"
        idEntidad={chofer?.idChofer || chofer?.id}
      />
      <DocumentacionForm
        open={isEditDocOpen}
        onOpenChange={setIsEditDocOpen}
        onSubmit={handleUpdateDocSubmit}
        defaultValues={selectedDoc}
        isLoading={loadingUpdate}
        mode="edit"
        tipoEntidad="CHOFER"
        idEntidad={chofer?.idChofer || chofer?.id}
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
        description={`¿Estás seguro de eliminar "${selectedDoc?.nombre}"?`}
      />
    </>
  );
};