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
import { toast } from 'sonner';

export const Cliente = () => {
  const {
    clientes, localidades, loading, error, loadingCreate, loadingUpdate,
    loadingLocalidades, loadingBaja, loadingReactivar,
    handleCreate, handleUpdate, handleBaja, handleReactivar, refetch,
  } = useCliente();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);

  // FUNCIONES DE ACCIÓN (Aseguramos que seleccionen el cliente correctamente)
  const handleViewClick = (cliente) => { setSelectedCliente(cliente); setIsDetailDialogOpen(true); };
  const handleEditClick = (cliente) => { setSelectedCliente(cliente); setIsEditDialogOpen(true); };
  const handleDeleteClick = (cliente) => { setSelectedCliente(cliente); setIsDeleteDialogOpen(true); };

  const handleCreateSubmit = async (data) => {
    const result = await handleCreate(data);
    if (result.success) { setIsCreateDialogOpen(false); toast.success('Cliente creado'); }
    return result;
  };

  const handleUpdateSubmit = async (data) => {
    if (!selectedCliente) return;
    const result = await handleUpdate(selectedCliente.idCliente || selectedCliente.id, data);
    if (result.success) { setIsEditDialogOpen(false); setSelectedCliente(null); toast.success('Cliente actualizado'); }
    return result;
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCliente) return;
    const result = await handleBaja(selectedCliente.idCliente || selectedCliente.id);
    if (result.success) { setIsDeleteDialogOpen(false); setSelectedCliente(null); toast.success('Cliente dado de baja'); }
  };

  // RECONSTRUCCIÓN DE COLUMNAS (Pasando las funciones de arriba)
  const columns = createClienteColumns(handleEditClick, handleDeleteClick, handleViewClick);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px 30px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">Gestiona todos tus clientes desde aquí</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button 
            variant="outline" 
            onClick={refetch} 
            style={{ height: '40px', padding: '0 20px', border: '1px solid #cbd5e1' }}
            className="flex items-center justify-center transition-all active:scale-95"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>

          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            style={{ backgroundColor: '#592673', color: 'white', height: '40px', padding: '0 20px', border: 'none' }}
            className="flex items-center justify-center font-medium transition-all hover:opacity-90 active:scale-95 shadow-md"
          >
            <Plus className="mr-2 h-5 w-5" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      <div className="w-full">
        <ClienteTable columns={columns} data={clientes} />
      </div>

      <ClienteDetailDialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen} cliente={selectedCliente} onReactivar={handleReactivar} />
      <ClienteForm open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onSubmit={handleCreateSubmit} localidades={localidades} mode="create" />
      <ClienteForm open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} onSubmit={handleUpdateSubmit} defaultValues={selectedCliente} localidades={localidades} mode="edit" />
      <DeleteConfirmationDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} onConfirm={handleDeleteConfirm} title="Dar de Baja" description={`¿Baja a ${selectedCliente?.nombreCompleto || 'este cliente'}?`} />
    </div>
  );
};