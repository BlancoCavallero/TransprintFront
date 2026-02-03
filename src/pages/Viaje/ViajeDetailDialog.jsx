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
import { Plus } from 'lucide-react';
import { User, Truck, MapPin, Calendar, DollarSign, Activity, Hash, FileText, Tag } from 'lucide-react';
import { useGastos } from '../../hooks/entities/useGastos';
import { GastoForm } from '../Gasto/GastoForm';
import { GastoTable } from '../Gasto/GastoTable';
import { GastoDetailDialog } from '../Gasto/GastoDetailDialog';
import { createGastoColumns } from '../Gasto/GastoTableColumns';
import { DeleteConfirmationDialog } from '@/components/Alert/DeleteConfirmationDialog';

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

  // Refrescar gastos cuando cambia el viaje
  useEffect(() => {
    if (open && viaje?.idViaje) {
      refetchGastos();
    }
  }, [open, viaje?.idViaje, refetchGastos]);

  if (!viaje) return null;

  const getEstadoColor = (estado) => {
    if (!estado) return 'bg-gray-100 text-gray-700';
    const estadoUpper = estado.toUpperCase();
    switch (estadoUpper) {
      case 'PROGRAMADO':
        return 'bg-blue-100 text-blue-700';
      case 'EN_CURSO':
      case 'EN CURSO':
        return 'bg-yellow-100 text-yellow-700';
      case 'FINALIZADO':
        return 'bg-green-100 text-green-700';
      case 'CANCELADO':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleViewGasto = (gasto) => {
    setSelectedGasto({ ...gasto });
    setIsDetailGastoOpen(true);
  };

  const handleEditGasto = (gasto) => {
    setSelectedGasto({ ...gasto });
    setIsEditGastoOpen(true);
  };

  const handleDeleteGastoClick = (gasto) => {
    setSelectedGasto({ ...gasto });
    setIsDeleteGastoOpen(true);
  };

  const handleCreateGastoSubmit = async (data) => {
    const result = await handleCreateGasto(data);
    if (result.success) {
      setIsCreateGastoOpen(false);
    }
    return result;
  };

  const handleUpdateGastoSubmit = async (data) => {
    if (!selectedGasto) return;
    const result = await handleUpdateGasto(
      selectedGasto.idGasto || selectedGasto.id,
      data,
      selectedGasto
    );
    if (result.success) {
      setIsEditGastoOpen(false);
      setSelectedGasto(null);
    }
    return result;
  };

  const handleDeleteGastoConfirm = async () => {
    if (!selectedGasto) return;
    const result = await handleDeleteGasto(selectedGasto.idGasto || selectedGasto.id);
    if (result.success) {
      setIsDeleteGastoOpen(false);
      setSelectedGasto(null);
    }
  };

  const gastosColumns = createGastoColumns(
    handleEditGasto,
    handleDeleteGastoClick,
    handleViewGasto
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Detalles del Viaje
            </DialogTitle>
            <DialogDescription>
              Información completa del viaje y gestión de gastos
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="detalles">Detalles del Viaje</TabsTrigger>
              <TabsTrigger value="gastos">Gastos ({gastos.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="detalles" className="space-y-6 mt-4">
              {/* Información del Viaje */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">Información del Viaje</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Estado</p>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-gray-400" />
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(viaje.estado)}`}>
                        {viaje.estado || 'Sin estado'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Precio</p>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <p className="text-sm font-medium">${viaje.precio?.toLocaleString('es-ES') || 0}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Fecha Inicio</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-sm">{viaje.fechaInicio ? new Date(viaje.fechaInicio).toLocaleDateString('es-ES') : 'Sin fecha'}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Fecha Fin</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-sm">{viaje.fechaFin ? new Date(viaje.fechaFin).toLocaleDateString('es-ES') : 'Sin fecha'}</p>
                    </div>
                  </div>

                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-gray-500">Kilómetros</p>
                    <p className="text-sm font-medium">{viaje.kilometros || 0} km</p>
                  </div>
                </div>
              </div>

              {/* Información del Cliente */}
              {viaje.cliente && (
                <div className="space-y-3 pt-3 border-t">
                  <h3 className="text-sm font-semibold text-gray-900">Información del Cliente</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Razón Social / Nombre</p>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <p className="text-sm font-medium">
                          {viaje.cliente.razonSocial || 
                           (viaje.cliente.persona ? `${viaje.cliente.persona.nombre} ${viaje.cliente.persona.apellido}` : 'Sin nombre')}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Tipo</p>
                      <p className="text-sm">{viaje.cliente.tipo || 'Sin tipo'}</p>
                    </div>

                    {viaje.cliente.correo && (
                      <div className="space-y-1 col-span-2">
                        <p className="text-xs text-gray-500">Correo</p>
                        <p className="text-sm">{viaje.cliente.correo}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Información del Chofer */}
              {viaje.chofer && (
                <div className="space-y-3 pt-3 border-t">
                  <h3 className="text-sm font-semibold text-gray-900">Información del Chofer</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Nombre</p>
                      <p className="text-sm font-medium">
                        {viaje.chofer.persona ? `${viaje.chofer.persona.nombre} ${viaje.chofer.persona.apellido}` : 'Sin nombre'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">DNI</p>
                      <p className="text-sm">{viaje.chofer.dni || 'Sin DNI'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Información del Vehículo */}
              {viaje.vehiculo && (
                <div className="space-y-3 pt-3 border-t">
                  <h3 className="text-sm font-semibold text-gray-900">Información del Vehículo</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Patente</p>
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-gray-400" />
                        <p className="text-sm font-medium">{viaje.vehiculo.patente || 'Sin patente'}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Marca y Modelo</p>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-gray-400" />
                        <p className="text-sm">{viaje.vehiculo.marca} {viaje.vehiculo.modelo}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Observaciones */}
              {viaje.observaciones && (
                <div className="space-y-3 pt-3 border-t">
                  <h3 className="text-sm font-semibold text-gray-900">Observaciones</h3>
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                    <p className="text-sm bg-gray-50 p-3 rounded-md border border-gray-200 flex-1">
                      {viaje.observaciones}
                    </p>
                  </div>
                </div>
              )}

              {/* Motivo Cancelación */}
              {viaje.motivoCancelacion && (
                <div className="space-y-3 pt-3 border-t">
                  <h3 className="text-sm font-semibold text-red-900">Motivo de Cancelación</h3>
                  <p className="text-sm bg-red-50 p-3 rounded-md border border-red-200">
                    {viaje.motivoCancelacion}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="gastos" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  Gastos del Viaje ({gastos.length})
                </h3>
                <Button onClick={() => setIsCreateGastoOpen(true)} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar Gasto
                </Button>
              </div>

              {loadingGastos ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-sm text-gray-500">Cargando gastos...</p>
                </div>
              ) : (
                <GastoTable columns={gastosColumns} data={gastos} />
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Diálogos de Gastos */}
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
        description={`¿Estás seguro de eliminar el gasto de tipo "${selectedGasto?.tipo}"? Esta acción no se puede deshacer.`}
      />
    </>
  );
};
