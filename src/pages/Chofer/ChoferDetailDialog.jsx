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
import { User, Phone, FileText, Hash, AlertCircle } from 'lucide-react';
import { useDocumentacion } from '../../hooks/entities/useDocumentacion';
import { DocumentacionForm } from '../Documentacion/DocumentacionForm';
import { DocumentacionTable } from '../Documentacion/DocumentacionTable';
import { DocumentacionDetailDialog } from '../Documentacion/DocumentacionDetailDialog';
import { createDocumentacionColumns } from '../Documentacion/DocumentacionTableColumns';
import { DeleteConfirmationDialog } from '@/components/Alert/DeleteConfirmationDialog';

export const ChoferDetailDialog = ({ open, onOpenChange, chofer }) => {
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
  } = useDocumentacion(chofer?.idChofer || chofer?.id, 'CHOFER');

  // Refrescar documentaciones cuando cambia el chofer
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
    if (!estado) return 'bg-gray-100 text-gray-700';
    if (estado === 'Disponible') return 'bg-green-100 text-green-700';
    if (estado === 'Inhabilitado') return 'bg-red-100 text-red-700';
    if (estado === 'En viaje') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
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
    }
    return result;
  };

  const handleDeleteDocConfirm = async () => {
    if (!selectedDoc) return;
    const result = await handleDeleteDoc(selectedDoc.idDocumentacion || selectedDoc.id);
    if (result.success) {
      setIsDeleteDocOpen(false);
      setSelectedDoc(null);
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
            <DialogTitle className="text-2xl flex items-center gap-2">
              <User className="h-6 w-6 text-primary" />
              Detalles del Chofer
            </DialogTitle>
            <DialogDescription>
              Información completa del chofer y gestión de documentación
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="detalles">Detalles del Chofer</TabsTrigger>
              <TabsTrigger value="documentacion">Documentación ({documentaciones.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="detalles" className="space-y-6 mt-4">
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
        </TabsContent>

        <TabsContent value="documentacion" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Documentación del Chofer ({documentaciones.length})
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
    description={`¿Estás seguro de eliminar la documentación "${selectedDoc?.nombre}"? Esta acción no se puede deshacer.`}
  />
</>
  );
};
