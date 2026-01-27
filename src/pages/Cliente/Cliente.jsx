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
import { useAuth } from '../../hooks/useAuth';

export const Cliente = () => {
  const {
    clientes,
    localidades,
    loading,
    loadingLocalidades,
    error,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch,
  } = useCliente();


  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const {user } =useAuth();

  const handleViewClick = (cliente) => {
    setSelectedCliente(cliente);
    setIsDetailDialogOpen(true);
  };

  const handleEditClick = (cliente) => {
    setSelectedCliente(cliente);
    setIsEditDialogOpen(true);
    console.log("Usuario en Cliente.jsx:", user);
  };

  const handleDeleteClick = (cliente) => {
    setSelectedCliente(cliente);
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
    if (!selectedCliente) return;
    const result = await handleUpdate(selectedCliente.idCliente || selectedCliente.id, data);
    if (result.success) {
      setIsEditDialogOpen(false);
      setSelectedCliente(null);
    }
    return result;
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCliente) return;
    const result = await handleDelete(selectedCliente.idCliente || selectedCliente.id);
    if (result.success) {
      setIsDeleteDialogOpen(false);
      setSelectedCliente(null);
    }
  };

  const columns = createClienteColumns(handleEditClick, handleDeleteClick, handleViewClick);

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
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona todos tus clientes desde aquí
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refetch} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cliente
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

      <ClienteTable columns={columns} data={clientes} />

      <ClienteDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        cliente={selectedCliente}
      />

      <ClienteForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateSubmit}
        localidades={localidades}
        loadingLocalidades={loadingLocalidades}
        isLoading={loadingCreate}
        mode="create"
      />

      <ClienteForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateSubmit}
        defaultValues={selectedCliente}
        localidades={localidades}
        loadingLocalidades={loadingLocalidades}
        isLoading={loadingUpdate}
        mode="edit"
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={loadingDelete}
        description={`¿Estás seguro de eliminar a ${selectedCliente?.nombreCompleto || selectedCliente?.razonSocial}? Esta acción no se puede deshacer.`}
      />
    </div>
  );
};
