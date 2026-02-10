import { useState } from 'react';
import { useMantenimiento } from '../../hooks/entities/useMantenimiento';
import { MantenimientoTable } from './MantenimientoTable';
import { MantenimientoForm } from './MantenimientoForm';
import { MantenimientoDetailDialog } from './MantenimientoDetailDialog';
import { createMantenimientoColumns } from './MantenimientoTableColumns';
import { DeleteConfirmationDialog } from '@/components/Alert/DeleteConfirmationDialog';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const Mantenimiento = () => {
  const {
    mantenimientos,
    loading,
    error,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch,
  } = useMantenimiento();

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
      toast.success('Mantenimiento creado exitosamente', {
        description: 'El mantenimiento ha sido registrado en el sistema.'
      });
    } else {
      toast.error('Error al crear mantenimiento', {
        description: result.error || 'Ocurrió un error al intentar crear el mantenimiento.'
      });
    }
    return result;
  };

  const handleUpdateSubmit = async (data) => {
    if (!selectedItem) return;
    const result = await handleUpdate(
      selectedItem.idMantenimiento || selectedItem.id,
      data,
      selectedItem
    );
    if (result.success) {
      setIsEditDialogOpen(false);
      setSelectedItem(null);
      toast.success('Mantenimiento actualizado exitosamente', {
        description: 'Los datos del mantenimiento han sido actualizados.'
      });
    } else {
      toast.error('Error al actualizar mantenimiento', {
        description: result.error || 'Ocurrió un error al intentar actualizar el mantenimiento.'
      });
    }
    return result;
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    const result = await handleDelete(selectedItem.idMantenimiento || selectedItem.id);
    if (result.success) {
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
      toast.success('Mantenimiento eliminado exitosamente', {
        description: 'El mantenimiento ha sido eliminado del sistema.'
      });
    } else {
      toast.error('Error al eliminar mantenimiento', {
        description: result.error || 'Ocurrió un error al intentar eliminar el mantenimiento.'
      });
    }
  };

  const columns = createMantenimientoColumns(
    handleEditClick,
    handleDeleteClick,
    handleViewClick
  );

  if (loading && !mantenimientos.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px 30px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mantenimientos</h1>
          <p className="text-muted-foreground">
            Gestiona todos los mantenimientos desde aquí
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button 
            variant="outline" 
            onClick={() => refetch()} 
            disabled={loading}
            style={{ height: '40px', padding: '0 20px', border: '1px solid #cbd5e1' }}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            style={{ backgroundColor: '#592673', color: 'white', height: '40px', padding: '0 20px', border: 'none' }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Mantenimiento
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="w-full">
        <MantenimientoTable columns={columns} data={mantenimientos} />
      </div>

      <MantenimientoForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateSubmit}
        isLoading={loadingCreate}
        mode="create"
      />

      <MantenimientoForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateSubmit}
        defaultValues={selectedItem}
        isLoading={loadingUpdate}
        mode="edit"
      />

      <MantenimientoDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        mantenimiento={selectedItem}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={loadingDelete}
        title="Eliminar Mantenimiento"
        confirmText="Eliminar"
        description={`¿Estás seguro de eliminar el mantenimiento del vehículo ${selectedItem?.vehiculo?.patente || 'seleccionado'}? Esta acción no se puede deshacer.`}
      />
    </div>
  );
};