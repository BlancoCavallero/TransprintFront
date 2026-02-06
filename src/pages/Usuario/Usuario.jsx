import { useState } from 'react';
import { useUsuario } from '../../hooks/entities/useUsuario';
import { UsuarioTable } from './UsuarioTable';
import { UsuarioForm } from './UsuarioForm';
import { createUsuarioColumns } from './UsuarioTableColumns';
import { DeleteConfirmationDialog } from '@/components/Alert/DeleteConfirmationDialog';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const Usuario = () => {
  const {
    usuarios,
    loading,
    error,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch,
  } = useUsuario();


  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  const handleEditClick = (item) => {
     setSelectedUsuario({ ...item }); 
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedUsuario(item);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateSubmit = async (data) => {
    const result = await handleCreate(data);
    if (result.success) {
      setIsCreateDialogOpen(false);
      toast.success('Usuario creado exitosamente', {
        description: `${data.nombre_completo || data.username} ha sido agregado al sistema.`
      });
    } else {
      toast.error('Error al crear usuario', {
        description: result.error || 'Ocurrió un error al intentar crear el usuario.'
      });
    }
    return result;
  };

  const handleUpdateSubmit = async (data) => {
    if (!selectedUsuario) return;
    const result = await handleUpdate(selectedUsuario.user_id, data, selectedUsuario);
    if (result.success) {
      setIsEditDialogOpen(false);
      setSelectedUsuario(null);
      toast.success('Usuario actualizado exitosamente', {
        description: `Los datos de ${data.nombre_completo || data.username} han sido actualizados.`
      });
    } else {
      toast.error('Error al actualizar usuario', {
        description: result.error || 'Ocurrió un error al intentar actualizar el usuario.'
      });
    }
    return result;
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUsuario) return;
    const result = await handleDelete(selectedUsuario.user_id);
    if (result.success) {
      setIsDeleteDialogOpen(false);
      setSelectedUsuario(null);
      toast.success('Usuario eliminado exitosamente', {
        description: `${selectedUsuario.nombre_completo || selectedUsuario.username} ha sido eliminado del sistema.`
      });
    } else {
      toast.error('Error al eliminar usuario', {
        description: result.error || 'Ocurrió un error al intentar eliminar el usuario.'
      });
    }
  };

  const columns = createUsuarioColumns(handleEditClick, handleDeleteClick);

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
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">
            Gestiona todos tus usuarios desde aquí
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refetch} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
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

      <UsuarioTable columns={columns} data={usuarios} />

      <UsuarioForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateSubmit}
        isLoading={loadingCreate}
        mode="create"
      />

      <UsuarioForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateSubmit}
        defaultValues={selectedUsuario}
        isLoading={loadingUpdate}
        mode="edit"
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={loadingDelete}
        description={`¿Estás seguro de eliminar a ${selectedUsuario?.nombre_completo || selectedUsuario?.username || "este usuario"}? Esta acción no se puede deshacer.`}
      />
    </div>
  );
};
