import { useState } from 'react';
import { useViajes } from '../../hooks/entities/useViajes';
import { ViajeTable } from './ViajeTable';
import { ViajeForm } from './ViajeForm';
import { ViajeDetailDialog } from './ViajeDetailDialog';
import { createViajeColumns } from './ViajeTableColumns';
import { DeleteConfirmationDialog } from '@/components/Alert/DeleteConfirmationDialog';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
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
      toast.success('Viaje creado exitosamente', {
        description: 'El viaje ha sido registrado en el sistema.'
      });
    } else {
      toast.error('Error al crear viaje', {
        description: result.error || 'Ocurrió un error al intentar crear el viaje.'
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
      toast.success('Viaje actualizado exitosamente', {
        description: 'Los datos del viaje han sido actualizados.'
      });
    } else {
      toast.error('Error al actualizar viaje', {
        description: result.error || 'Ocurrió un error al intentar actualizar el viaje.'
      });
    }
    return result;
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    const result = await handleDelete(selectedItem.idViaje || selectedItem.id);
    if (result.success) {
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
      toast.success('Viaje eliminado exitosamente', {
        description: 'El viaje ha sido eliminado del sistema.'
      });
    } else {
      toast.error('Error al eliminar viaje', {
        description: result.error || 'Ocurrió un error al intentar eliminar el viaje.'
      });
    }
  };

  const columns = createViajeColumns(
    handleEditClick,
    handleDeleteClick,
    handleViewClick
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Viajes</h1>
          <p className="text-muted-foreground">
            Gestiona todos los viajes desde aquí
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refetch} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Viaje
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ViajeTable columns={columns} data={viajes} />

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
