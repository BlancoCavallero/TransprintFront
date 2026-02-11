import { useState } from 'react';
import { useViajes } from '../../hooks/entities/useViajes';
import { ViajeTable } from './ViajeTable';
import { ViajeForm } from './ViajeForm';
import { ViajeDetailDialog } from './ViajeDetailDialog';
import { createViajeColumns } from './ViajeTableColumns';
import { DeleteConfirmationDialog } from '@/components/Alert/DeleteConfirmationDialog';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Map } from 'lucide-react'; // Añadí Map para el icono del título
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const Viaje = () => {
  const {
    viajes,
    loading,
    error,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch,
  } = useViajes();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleViewClick = (item) => {
    setSelectedItem({ ...item });
    setIsDetailDialogOpen(true);
  };

  const handleEditClick = (item) => {
    setSelectedItem({ ...item });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem({ ...item });
    setIsDeleteDialogOpen(true);
  };

  const handleCreateSubmit = async (data) => {
    const result = await handleCreate(data);
    if (result.success) {
      setIsCreateDialogOpen(false);
      toast.success('Viaje creado exitosamente');
    } else {
      toast.error('Error al crear viaje', {
        description: result.error || 'Ocurrió un error.'
      });
    }
    return result;
  };

  const handleUpdateSubmit = async (data) => {
    if (!selectedItem) return;
    const result = await handleUpdate(
      selectedItem.idViaje || selectedItem.id,
      data,
      selectedItem
    );
    if (result.success) {
      setIsEditDialogOpen(false);
      setSelectedItem(null);
      toast.success('Viaje actualizado exitosamente');
    } else {
      toast.error('Error al actualizar viaje');
    }
    return result;
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    const result = await handleDelete(selectedItem.idViaje || selectedItem.id);
    if (result.success) {
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
      toast.success('Viaje eliminado exitosamente');
    }
  };

  const columns = createViajeColumns(
    handleEditClick,
    handleDeleteClick,
    handleViewClick
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <RefreshCw className="h-10 w-10 animate-spin" style={{ color: '#592673' }} />
        <p className="text-sm font-medium text-slate-500">Cargando viajes...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '10px 0' }}>
      {/* Header idéntico a Cliente/Chofer */}
      <div className="flex items-center justify-between mb-8" style={{ padding: '0 20px' }}>
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
             <Map className="h-8 w-8" style={{ color: '#592673' }} />
             Viajes
          </h1>
          <p className="text-base text-muted-foreground mt-1">
            Gestiona la logística y el seguimiento de los viajes.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button 
            variant="outline" 
            onClick={refetch} 
            disabled={loading}
            style={{ border: '1px solid #cbd5e1', height: '45px', padding: '0 20px' }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            style={{ backgroundColor: '#592673', color: 'white', height: '45px', padding: '0 25px' }}
          >
            <Plus className="mr-2 h-5 w-5" />
            Nuevo Viaje
          </Button>
        </div>
      </div>

      {error && (
        <div style={{ margin: '0 20px 20px 20px' }}>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Tabla de Viajes */}
      <ViajeTable columns={columns} data={viajes} />

      {/* Diálogos */}
      <ViajeForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateSubmit}
        isLoading={loadingCreate}
        mode="create"
      />

      <ViajeForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateSubmit}
        defaultValues={selectedItem}
        isLoading={loadingUpdate}
        mode="edit"
      />

      <ViajeDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        viaje={selectedItem}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={loadingDelete}
        description={`¿Estás seguro de eliminar este viaje? Esta acción no se puede deshacer.`}
      />
    </div>
  );
};