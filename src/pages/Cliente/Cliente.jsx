import { useState } from 'react';
import { useCliente } from '../../hooks/entities/useCliente';
import { ClienteTable } from './ClienteTable';
import { ClienteForm } from './ClienteForm';
import { ClienteDetailDialog } from './ClienteDetailDialog';
import { createClienteColumns } from './ClienteTableColumns';
import { DeleteConfirmationDialog } from '@/components/Alert/DeleteConfirmationDialog';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const Cliente = () => {
  const {
    clientes,
    localidades,
    loading,
    error,
    loadingCreate,
    loadingUpdate,
    loadingBaja,
    loadingReactivar,
    handleCreate,
    handleUpdate,
    handleBaja,
    handleReactivar,
    refetch,
  } = useCliente();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);

  const handleViewClick = (cliente) => {
    setSelectedCliente(cliente);
    setIsDetailDialogOpen(true);
  };

  const handleEditClick = (cliente) => {
    setSelectedCliente(cliente);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (cliente) => {
    setSelectedCliente(cliente);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateSubmit = async (data) => {
    const result = await handleCreate(data);
    if (result.success) {
      setIsCreateDialogOpen(false);
      toast.success('Cliente creado exitosamente', {
        description: `${data.nombre} ${data.apellido} ha sido agregado al sistema.`
      });
      // El hook useCliente ya hace el fetchClientes() interno, 
      // pero llamamos a refetch por seguridad de sincronización
      await refetch();
    } else {
      toast.error('Error al crear cliente', {
        description: result.error || 'Ocurrió un error al intentar crear el cliente.'
      });
    }
    return result;
  };

  const handleUpdateSubmit = async (data) => {
    if (!selectedCliente) return;
    const result = await handleUpdate(selectedCliente.idCliente || selectedCliente.id, data);
    if (result.success) {
      setIsEditDialogOpen(false);
      setSelectedCliente(null);
      toast.success('Cliente actualizado exitosamente', {
        description: `Los datos de ${data.nombre} ${data.apellido} han sido actualizados.`
      });
      await refetch();
    } else {
      toast.error('Error al actualizar cliente', {
        description: result.error || 'Ocurrió un error al intentar actualizar el cliente.'
      });
    }
    return result;
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCliente) return;
    
    const id = selectedCliente.idCliente || selectedCliente.id;
    const result = await handleBaja(id);
    
    if (result.success) {
      setIsDeleteDialogOpen(false);
      // Guardamos el nombre para el toast antes de limpiar el seleccionado
      const nombreCliente = selectedCliente.nombreCompleto || 'El cliente';
      setSelectedCliente(null);
      
      toast.success('Cliente dado de baja exitosamente', {
        description: `${nombreCliente} ha sido dado de baja.`
      });
      
      // Forzamos el refetch y esperamos a que termine para asegurar la tabla
      await refetch();
    } else {
      toast.error('Error al dar de baja cliente', {
        description: result.error || 'Ocurrió un error al intentar dar de baja el cliente.'
      });
    }
  };

  const handleReactivarCliente = async (cliente) => {
    const result = await handleReactivar(cliente.idCliente || cliente.id);
    if (result.success) {
      setIsDetailDialogOpen(false);
      toast.success('Cliente reactivado exitosamente', {
        description: `${cliente.nombreCompleto} ha sido reactivado.`
      });
      await refetch();
    } else {
      toast.error('Error al reactivar cliente', {
        description: result.error || 'Ocurrió un error al intentar reactivar el cliente.'
      });
    }
  };

  const columns = createClienteColumns(
    handleEditClick, 
    handleDeleteClick, 
    handleViewClick, 
    handleReactivarCliente,
    loadingReactivar
  );

  if (loading && !clientes.length) {
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
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">Gestiona todos tus clientes desde aquí</p>
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
            Nuevo Cliente
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
        <ClienteTable columns={columns} data={clientes} />
      </div>

      <ClienteDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        cliente={selectedCliente}
        onReactivar={handleReactivarCliente}
        loadingReactivar={loadingReactivar}
      />

      <ClienteForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateSubmit}
        localidades={localidades}
        isLoading={loadingCreate}
        mode="create"
      />

      <ClienteForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateSubmit}
        defaultValues={selectedCliente}
        localidades={localidades}
        isLoading={loadingUpdate}
        mode="edit"
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={loadingBaja}
        description={`¿Estás seguro de dar de baja a ${selectedCliente?.nombreCompleto || 'este cliente'}?`}
        title="Dar de Baja Cliente"
        confirmText="Dar de Baja"
      />
    </div>
  );
};