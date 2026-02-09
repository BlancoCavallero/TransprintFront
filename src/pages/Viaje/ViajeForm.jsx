import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { getViajeSchema } from './viajeSchema';
import { useChofer } from '../../hooks/entities/useChofer';
import { useVehiculo } from '../../hooks/entities/useVehiculo';
import { useCliente } from '../../hooks/entities/useCliente';
import { useLocalidad } from '../../hooks/entities/useLocalidad';

export const ViajeForm = ({ open, onOpenChange, onSubmit, defaultValues, isLoading = false, mode = 'create' }) => {
  const schema = getViajeSchema(mode);
  const { choferes, loading: loadingChoferes } = useChofer({ estado: 'Habilitado' });
  const { vehiculos, loading: loadingVehiculos } = useVehiculo({ estado: 'Habilitado' });
  const { clientes: allClientes, loading: loadingClientes } = useCliente();
  const { localidades, loading: loadingLocalidades } = useLocalidad();
  
  // Filtrar solo clientes activos
  const clientes = allClientes.filter(cliente => cliente.activo === 1);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      idChofer: '',
      idVehiculo: '',
      idCliente: '',
      idLocalidadOrigen: '',
      idLocalidadDestino: '',
      fechaInicio: '',
      fechaFin: '',
      kilometros: '',
      precio: '',
      observaciones: '',
      estado: '',
      motivoCancelacion: '',
    },
  });

  const watchEstado = form.watch('estado');


  useEffect(() => {
    if (open && defaultValues && mode === 'edit') {
      form.reset({
        idChofer: defaultValues.idChofer || '',
        idVehiculo: defaultValues.idVehiculo || '',
        idCliente: defaultValues.idCliente || '',
        idLocalidadOrigen: defaultValues.idLocalidadOrigen || '',
        idLocalidadDestino: defaultValues.idLocalidadDestino || '',
        fechaInicio: defaultValues.fechaInicio?.split('T')[0] || '',
        fechaFin: defaultValues.fechaFin?.split('T')[0] || '',
        kilometros: defaultValues.kilometros || '',
        precio: defaultValues.precio || '',
        observaciones: defaultValues.observaciones || '',
        estado: '',
        motivoCancelacion: defaultValues.motivoCancelacion || '',
      });
    } else if (open && mode === 'create') {
      form.reset({
        idChofer: '',
        idVehiculo: '',
        idCliente: '',
        idLocalidadOrigen: '',
        idLocalidadDestino: '',
        fechaInicio: '',
        fechaFin: '',
        kilometros: '',
        precio: '',
        observaciones: '',
        estado: '',
        motivoCancelacion: '',
      });
    }
  }, [open, defaultValues, mode, form]);

  const handleSubmit = async (data) => {
    // z.coerce ya convierte los strings a números, no necesitamos hacerlo manualmente
    const payload = { ...data };

    if (mode === 'edit' && !data.estado) {
      delete payload.estado;
      delete payload.motivoCancelacion;
    }

    const result = await onSubmit(payload);
    if (result?.success) {
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Crear Viaje' : 'Editar Viaje'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Completa los datos para crear un nuevo viaje.' : 'Modifica los datos del viaje.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="idCliente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value?.toString()}
                      disabled={loadingClientes}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={loadingClientes ? "Cargando..." : "Seleccione un cliente"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clientes.map((cliente) => (
                          <SelectItem 
                            key={cliente.idCliente} 
                            value={cliente.idCliente.toString()}
                          >
                            {cliente.razonSocial || `${cliente.persona?.nombre} ${cliente.persona?.apellido}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="idChofer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chofer</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value?.toString()}
                      disabled={loadingChoferes}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={loadingChoferes ? "Cargando..." : "Seleccione un chofer"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {choferes.map((chofer) => (
                          <SelectItem 
                            key={chofer.idChofer} 
                            value={chofer.idChofer.toString()}
                          >
                            {chofer.persona?.nombre} {chofer.persona?.apellido}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="idVehiculo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehículo</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value?.toString()}
                    disabled={loadingVehiculos}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={loadingVehiculos ? "Cargando..." : "Seleccione un vehículo"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehiculos.map((vehiculo) => (
                        <SelectItem 
                          key={vehiculo.idVehiculo} 
                          value={vehiculo.idVehiculo.toString()}
                        >
                          {vehiculo.patente} - {vehiculo.marca} {vehiculo.modelo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="idLocalidadOrigen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localidad Origen</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value?.toString()}
                      disabled={loadingLocalidades}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={loadingLocalidades ? "Cargando..." : "Seleccione origen"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {localidades.map((localidad) => (
                          <SelectItem 
                            key={localidad.idLocalidad} 
                            value={localidad.idLocalidad.toString()}
                          >
                            {localidad.localidad} - {localidad.provincia}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="idLocalidadDestino"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localidad Destino</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value?.toString()}
                      disabled={loadingLocalidades}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={loadingLocalidades ? "Cargando..." : "Seleccione destino"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {localidades.map((localidad) => (
                          <SelectItem 
                            key={localidad.idLocalidad} 
                            value={localidad.idLocalidad.toString()}
                          >
                            {localidad.localidad} - {localidad.provincia}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fechaInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Inicio</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaFin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Fin</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="kilometros"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kilómetros</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="precio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {mode === 'edit' && (
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado (opcional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="No cambiar estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CANCELADO">Cancelar Viaje</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {mode === 'edit' && watchEstado === 'CANCELADO' && (
              <FormField
                control={form.control}
                name="motivoCancelacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivo de Cancelación</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ingrese el motivo de la cancelación..." 
                        className="resize-none"
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Ingrese observaciones adicionales..." 
                      className="resize-none"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === 'create' ? 'Creando...' : 'Actualizando...'}
                  </>
                ) : (
                  mode === 'create' ? 'Crear' : 'Actualizar'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};