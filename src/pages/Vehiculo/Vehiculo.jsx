import { useState } from 'react';
import { useVehiculo } from '../../hooks/entities/useVehiculo';
import { VehiculoTable } from './VehiculoTable';
import { VehiculoForm } from './VehiculoForm';
import { VehiculoDetailDialog } from './VehiculoDetailDialog';
import { createVehiculoColumns } from './VehiculoTableColumns';
import { DeleteConfirmationDialog } from '@/components/Alert/DeleteConfirmationDialog';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const Vehiculo = () => {
  const {
    vehiculos,
    loading,
    error,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    loadingBaja,
    loadingReactivar,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleBaja,
    handleReactivar,
    refetch,
  } = useVehiculo();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);

  const handleViewClick = (item) => {
    setSelectedVehiculo({ ...item });
    setIsDetailDialogOpen(true);
  };

  const handleEditClick = (item) => {
    setSelectedVehiculo({ ...item });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedVehiculo({ ...item });
    setIsDeleteDialogOpen(true);
  };

  const handleCreateSubmit = async (data) => {
    const result = await handleCreate(data);
    if (result.success) {
      setIsCreateDialogOpen(false);
      toast.success('Vehículo creado exitosamente', {
        description: `El vehículo ${data.patente} ha sido agregado al sistema.`
      });
    } else {
      toast.error('Error al crear vehículo', {
        description: result.error || 'Ocurrió un error al intentar crear el vehículo.'
      });
    }
    return result;
  };

  const handleUpdateSubmit = async (data) => {
    if (!selectedVehiculo) return;
    const result = await handleUpdate(
      selectedVehiculo.idVehiculo || selectedVehiculo.id,
      data,
      selectedVehiculo
    );
    if (result.success) {
      setIsEditDialogOpen(false);
      setSelectedVehiculo(null);
      toast.success('Vehículo actualizado exitosamente', {
        description: `Los datos del vehículo ${data.patente} han sido actualizados.`
      });
    } else {
      toast.error('Error al actualizar vehículo', {
        description: result.error || 'Ocurrió un error al intentar actualizar el vehículo.'
      });
    }
    return result;
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVehiculo) return;
    const result = await handleBaja(selectedVehiculo.idVehiculo || selectedVehiculo.id);
    if (result.success) {
      setIsDeleteDialogOpen(false);
      setSelectedVehiculo(null);
      toast.success('Vehículo dado de baja exitosamente', {
        description: `El vehículo ${selectedVehiculo.patente} ha sido dado de baja del sistema.`
      });
    } else {
      toast.error('Error al dar de baja vehículo', {
        description: result.error || 'Ocurrió un error al intentar dar de baja el vehículo.'
      });
    }
  };

  const handleReactivarVehiculo = async (vehiculo) => {
    const result = await handleReactivar(vehiculo.idVehiculo || vehiculo.id);
    if (result.success) {
      setIsDetailDialogOpen(false);
      toast.success('Vehículo reactivado exitosamente', {
        description: `El vehículo ${vehiculo.patente} ha sido reactivado.`
      });
    } else {
      toast.error('Error al reactivar vehículo', {
        description: result.error || 'Ocurrió un error al intentar reactivar el vehículo.'
      });
    }
  };

  const handleDetailDialogChange = (nextOpen) => {
    setIsDetailDialogOpen(nextOpen);
    if (!nextOpen) {
      refetch();
    }
  };

  const columns = createVehiculoColumns(
    handleEditClick,
    handleDeleteClick,
    handleViewClick,
    handleReactivarVehiculo,
    loadingReactivar
  );

  if (loading && !vehiculos.length) {
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
          <h1 className="text-3xl font-bold tracking-tight">Vehículos</h1>
          <p className="text-muted-foreground">Gestiona todos tus vehículos desde aquí</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' ,  flexWrap: 'wrap' }}>
          <Button 
            variant="outline" 
            onClick={refetch} 
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
            <Plus className="mr-2 h-5 w-5" />
            Nuevo Vehículo
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
        <VehiculoTable columns={columns} data={vehiculos} />
      </div>

      <VehiculoDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        vehiculo={selectedVehiculo}
        onReactivar={handleReactivarVehiculo}
        loadingReactivar={loadingReactivar}
      />

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

      <VehiculoDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={handleDetailDialogChange}
        vehiculo={selectedVehiculo}
        onReactivar={handleReactivarVehiculo}
        loadingReactivar={loadingReactivar}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={loadingBaja}
        description={`¿Estás seguro de dar de baja el vehículo ${selectedVehiculo?.patente}? Este vehículo no podrá gestionar documentación hasta que sea reactivado.`}
        title="Dar de Baja Vehículo"
        confirmText="Dar de Baja"
      />
    </div>
  );
};