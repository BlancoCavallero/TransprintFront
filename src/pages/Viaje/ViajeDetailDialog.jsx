import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, User, Truck, MapPin, Calendar, DollarSign, Activity, Hash, FileText, Tag, ReceiptText } from 'lucide-react';
import { useGastos } from '../../hooks/entities/useGastos';
import { GastoForm } from '../Gasto/GastoForm';
import { GastoTable } from '../Gasto/GastoTable';
import { GastoDetailDialog } from '../Gasto/GastoDetailDialog';
import { createGastoColumns } from '../Gasto/GastoTableColumns';
import { DeleteConfirmationDialog } from '@/components/Alert/DeleteConfirmationDialog';
import { toast } from 'sonner';

export const ViajeDetailDialog = ({ open, onOpenChange, viaje }) => {
  const [activeTab, setActiveTab] = useState('detalles');
  const [isCreateGastoOpen, setIsCreateGastoOpen] = useState(false);
  const [isEditGastoOpen, setIsEditGastoOpen] = useState(false);
  const [isDeleteGastoOpen, setIsDeleteGastoOpen] = useState(false);
  const [isDetailGastoOpen, setIsDetailGastoOpen] = useState(false);
  const [selectedGasto, setSelectedGasto] = useState(null);

  const {
    gastos,
    loading: loadingGastos,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    handleCreate: handleCreateGasto,
    handleUpdate: handleUpdateGasto,
    handleDelete: handleDeleteGasto,
    refetch: refetchGastos,
  } = useGastos(viaje?.idViaje);

  useEffect(() => {
    if (open && viaje?.idViaje) {
      refetchGastos();
    }
  }, [open, viaje?.idViaje, refetchGastos]);

  if (!viaje) return null;

  // Estilos de badges para estados de viaje
  const getEstadoColor = (estado) => {
    if (!estado) return 'bg-gray-100 text-gray-700 border-gray-200';
    const estadoUpper = estado.toUpperCase();
    switch (estadoUpper) {
      case 'PROGRAMADO':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'EN_CURSO':
      case 'EN CURSO':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'FINALIZADO':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'CANCELADO':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const cardStyle = {
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };

  // Handlers (Lógica intacta)
  const handleViewGasto = (gasto) => { setSelectedGasto({ ...gasto }); setIsDetailGastoOpen(true); };
  const handleEditGasto = (gasto) => { setSelectedGasto({ ...gasto }); setIsEditGastoOpen(true); };
  const handleDeleteGastoClick = (gasto) => { setSelectedGasto({ ...gasto }); setIsDeleteGastoOpen(true); };

  const handleCreateGastoSubmit = async (data) => {
    const result = await handleCreateGasto(data);
    if (result.success) {
      setIsCreateGastoOpen(false);
      toast.success('Gasto registrado exitosamente');
    } else {
      toast.error('Error al registrar gasto', { description: result.error });
    }
    return result;
  };

  const handleUpdateGastoSubmit = async (data) => {
    if (!selectedGasto) return;
    const result = await handleUpdateGasto(selectedGasto.idGasto || selectedGasto.id, data, selectedGasto);
    if (result.success) {
      setIsEditGastoOpen(false);
      setSelectedGasto(null);
      toast.success('Gasto actualizado exitosamente');
    } else {
      toast.error('Error al actualizar gasto', { description: result.error });
    }
    return result;
  };

  const handleDeleteGastoConfirm = async () => {
    if (!selectedGasto) return;
    const result = await handleDeleteGasto(selectedGasto.idGasto || selectedGasto.id);
    if (result.success) {
      setIsDeleteGastoOpen(false);
      setSelectedGasto(null);
      toast.success('Gasto eliminado exitosamente');
    } else {
      toast.error('Error al eliminar gasto', { description: result.error });
    }
  };

  const gastosColumns = createGastoColumns(handleEditGasto, handleDeleteGastoClick, handleViewGasto);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent style={{ padding: '30px', maxWidth: '750px' }} className="max-h-[85vh] overflow-y-auto">
          
          <DialogHeader style={{ marginBottom: '10px' }}>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <MapPin className="h-6 w-6" style={{ color: '#592673' }} />
              Detalles del Viaje
            </DialogTitle>
            <DialogDescription className="text-base">
              Seguimiento de trayecto, asignaciones y control de gastos operativos.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="detalles">Hoja de Ruta</TabsTrigger>
              <TabsTrigger value="gastos">Gestión de Gastos ({gastos.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="detalles" className="mt-0" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Status Header */}
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estado Actual</span>
                  <span className={`inline-flex items-center px-3 py-1 mt-1 rounded-full text-xs font-bold border ${getEstadoColor(viaje.estado)}`}>
                    {viaje.estado || 'SIN ESTADO'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Valor del Viaje</span>
                  <div className="flex items-center justify-end gap-1 text-xl font-black text-slate-900">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    {viaje.precio?.toLocaleString('es-ES') || 0}
                  </div>
                </div>
              </div>

              {/* Tiempos y Distancia */}
              <div style={cardStyle}>
                <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: '#592673' }}>
                  <Calendar className="h-4 w-4" /> Cronograma y Distancia
                </h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Fecha Inicio</p>
                    <p className="font-medium text-slate-900">{viaje.fechaInicio ? new Date(viaje.fechaInicio).toLocaleDateString('es-ES') : '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Fecha Fin</p>
                    <p className="font-medium text-slate-900">{viaje.fechaFin ? new Date(viaje.fechaFin).toLocaleDateString('es-ES') : '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Recorrido</p>
                    <p className="font-bold text-slate-900">{viaje.kilometros || 0} KM</p>
                  </div>
                </div>
              </div>

              {/* Cliente y Chofer */}
              <div className="grid grid-cols-2 gap-4">
                <div style={cardStyle}>
                  <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: '#592673' }}>
                    <User className="h-4 w-4" /> Cliente
                  </h3>
                  <p className="text-sm font-bold text-slate-900">
                    {viaje.cliente?.razonSocial || (viaje.cliente?.persona ? `${viaje.cliente.persona.nombre} ${viaje.cliente.persona.apellido}` : 'No asignado')}
                  </p>
                  <p className="text-xs text-slate-500">{viaje.cliente?.correo || 'Sin contacto'}</p>
                </div>

                <div style={cardStyle}>
                  <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: '#592673' }}>
                    <Activity className="h-4 w-4" /> Chofer
                  </h3>
                  <p className="text-sm font-bold text-slate-900">
                    {viaje.chofer?.persona ? `${viaje.chofer.persona.nombre} ${viaje.chofer.persona.apellido}` : 'No asignado'}
                  </p>
                  <p className="text-xs text-slate-500">DNI: {viaje.chofer?.dni || '—'}</p>
                </div>
              </div>

              {/* Vehículo */}
              <div style={cardStyle}>
                <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: '#592673' }}>
                  <Truck className="h-4 w-4" /> Unidad Asignada
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-2 rounded-lg font-mono font-bold text-slate-700 border">
                      {viaje.vehiculo?.patente || 'SIN PATENTE'}
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-slate-900">{viaje.vehiculo?.marca} {viaje.vehiculo?.modelo}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Observaciones y Cancelación */}
              {(viaje.observaciones || viaje.motivoCancelacion) && (
                <div className="space-y-3">
                  {viaje.observaciones && (
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                        <FileText className="h-3 w-3" /> Notas del viaje
                      </p>
                      <p className="text-sm text-slate-600 italic">"{viaje.observaciones}"</p>
                    </div>
                  )}
                  {viaje.motivoCancelacion && (
                    <div className="p-4 rounded-xl border border-red-200 bg-red-50">
                      <p className="text-xs font-bold text-red-400 uppercase mb-2">Motivo de Cancelación</p>
                      <p className="text-sm text-red-700 font-medium">{viaje.motivoCancelacion}</p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="gastos" className="space-y-4 mt-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Registro de Gastos</h3>
                  <p className="text-xs text-slate-500">Control de viáticos, combustible y otros.</p>
                </div>
                <Button 
                  onClick={() => setIsCreateGastoOpen(true)} 
                  size="sm"
                  style={{ backgroundColor: '#592673', color: 'white' }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Gasto
                </Button>
              </div>

              {loadingGastos ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-sm text-slate-500 italic">Cargando gastos...</p>
                </div>
              ) : (
                <div className="border rounded-xl overflow-hidden shadow-sm">
                  <GastoTable columns={gastosColumns} data={gastos} />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Modales de Gastos */}
      <GastoForm
        open={isCreateGastoOpen}
        onOpenChange={setIsCreateGastoOpen}
        onSubmit={handleCreateGastoSubmit}
        isLoading={loadingCreate}
        mode="create"
        idViaje={viaje?.idViaje}
      />
      <GastoForm
        open={isEditGastoOpen}
        onOpenChange={setIsEditGastoOpen}
        onSubmit={handleUpdateGastoSubmit}
        defaultValues={selectedGasto}
        isLoading={loadingUpdate}
        mode="edit"
        idViaje={viaje?.idViaje}
      />
      <GastoDetailDialog
        open={isDetailGastoOpen}
        onOpenChange={setIsDetailGastoOpen}
        gasto={selectedGasto}
      />
      <DeleteConfirmationDialog
        open={isDeleteGastoOpen}
        onOpenChange={setIsDeleteGastoOpen}
        onConfirm={handleDeleteGastoConfirm}
        isLoading={loadingDelete}
        description={`¿Estás seguro de eliminar el gasto de tipo "${selectedGasto?.tipo}"?`}
      />
    </>
  );
};