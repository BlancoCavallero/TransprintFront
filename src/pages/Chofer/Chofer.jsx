import { useState } from 'react';
import { useChofer } from '../../hooks/entities/useChofer';
import { ChoferTable } from './ChoferTable';
import { ChoferForm } from './ChoferForm';
import { ChoferDetailDialog } from './ChoferDetailDialog';
import { createChoferColumns } from './ChoferTableColumns';
import { DeleteConfirmationDialog } from '@/components/Alert/DeleteConfirmationDialog';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const Chofer = () => {
  const {
    choferes,
    loading,
    error,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch,
  } = useChofer();


  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedChofer, setSelectedChofer] = useState(null);

  const handleViewClick = (chofer) => {
    setSelectedChofer(chofer);
    setIsDetailDialogOpen(true);
  };

  const handleEditClick = (chofer) => {
    setSelectedChofer(chofer);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (chofer) => {
    setSelectedChofer(chofer);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateSubmit = async (data) => {
    const result = await handleCreate(data);
    if (result.success) {
      setIsCreateDialogOpen(false);
      toast.success('Chofer creado exitosamente', {
        description: `${data.nombreCompleto} ha sido agregado al sistema.`
      });
    } else {
      toast.error('Error al crear chofer', {
        description: result.error || 'Ocurrió un error al intentar crear el chofer.'
      });
    }
    return result;
  };

  const handleUpdateSubmit = async (data) => {
    if (!selectedChofer) return;
    const result = await handleUpdate(selectedChofer.idChofer || selectedChofer.id, data);
    if (result.success) {
      setIsEditDialogOpen(false);
      setSelectedChofer(null);
      toast.success('Chofer actualizado exitosamente', {
        description: `Los datos de ${data.nombreCompleto} han sido actualizados.`
      });
    } else {
      toast.error('Error al actualizar chofer', {
        description: result.error || 'Ocurrió un error al intentar actualizar el chofer.'
      });
    }
    return result;
  };

  const handleDeleteConfirm = async () => {
    if (!selectedChofer) return;
    const result = await handleDelete(selectedChofer.idChofer || selectedChofer.id);
    if (result.success) {
      setIsDeleteDialogOpen(false);
      setSelectedChofer(null);
      toast.success('Chofer eliminado exitosamente', {
        description: `${selectedChofer.nombreCompleto} ha sido eliminado del sistema.`
      });
    } else {
      toast.error('Error al eliminar chofer', {
        description: result.error || 'Ocurrió un error al intentar eliminar el chofer.'
      });
    }
  };

  const columns = createChoferColumns(handleEditClick, handleDeleteClick, handleViewClick);

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
          <h1 className="text-3xl font-bold tracking-tight">Chofer</h1>
          <p className="text-muted-foreground">
            Gestiona todos tus chofer desde aquí
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refetch} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Chofer
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

      <ChoferTable columns={columns} data={choferes} />

      <ChoferDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        chofer={selectedChofer}
      />

      <ChoferForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateSubmit}
        isLoading={loadingCreate}
        mode="create"
      />

      <ChoferForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateSubmit}
        defaultValues={selectedChofer}
        isLoading={loadingUpdate}
        mode="edit"
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={loadingDelete}
        description={`¿Estás seguro de eliminar a ${selectedChofer?.nombreCompleto}? Esta acción no se puede deshacer.`}
      />
    </div>
  );
};

