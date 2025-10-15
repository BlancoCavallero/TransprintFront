import { useState } from 'react';
import { useVehiculo } from '../../hooks/entities/useVehiculo';
import { VehiculoTable } from './VehiculoTable';
import { VehiculoForm } from './VehiculoForm';
import { createVehiculoColumns } from './VehiculoTableColumns';
import { DeleteConfirmationDialog } from '@/components/Alert/DeleteConfirmationDialog';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const Vehiculo = () => {
  const {
    vehiculos,
    loading,
    error,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch,
  } = useVehiculo();


  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);

  const handleEditClick = (item) => {
    setSelectedVehiculo(item);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedVehiculo(item);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateSubmit = async (data) => {
    const result = await handleCreate(data);
    if (result.success) {
      setIsCreateDialogOpen(false);
    }
    return result;
  };

  const handleUpdateSubmit = async (data) => {
    if (!selectedVehiculo) return;
    const result = await handleUpdate(selectedVehiculo.id, data);
    if (result.success) {
      setIsEditDialogOpen(false);
      setSelectedVehiculo(null);
    }
    return result;
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVehiculo) return;
    const result = await handleDelete(selectedVehiculo.id);
    if (result.success) {
      setIsDeleteDialogOpen(false);
      setSelectedVehiculo(null);
    }
  };

  const columns = createVehiculoColumns(handleEditClick, handleDeleteClick);

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
          <h1 className="text-3xl font-bold tracking-tight">Vehículos</h1>
          <p className="text-muted-foreground">
            Gestiona todos tus vehículos desde aquí
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refetch} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Vehículo
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

      <VehiculoTable columns={columns} data={vehiculos} />

      <VehiculoForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateSubmit}
        isLoading={loadingCreate}
        mode="create"
      />

      <VehiculoForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateSubmit}
        defaultValues={selectedVehiculo}
        isLoading={loadingUpdate}
        mode="edit"
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={loadingDelete}
        description={`¿Estás seguro de eliminar el vehículo ${selectedVehiculo?.placa}? Esta acción no se puede deshacer.`}
      />
    </div>
  );
};
