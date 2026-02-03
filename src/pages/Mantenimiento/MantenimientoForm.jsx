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
import { getMantenimientoSchema } from './mantenimientoSchema';
import { useVehiculo } from '../../hooks/entities/useVehiculo';

export const MantenimientoForm = ({ open, onOpenChange, onSubmit, defaultValues, isLoading = false, mode = 'create' }) => {
  const schema = getMantenimientoSchema(mode);
  const { vehiculos, loading: loadingVehiculos } = useVehiculo();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fechaInicio: '',
      fechaFin: '',
      tipo: '',
      observacion: '',
      idVehiculo: '',
    },
  });

  useEffect(() => {
    if (open && defaultValues && mode === 'edit') {
      form.reset({
        fechaInicio: defaultValues.fechaInicio || '',
        fechaFin: defaultValues.fechaFin || '',
        tipo: defaultValues.tipo || '',
        observacion: defaultValues.observaciones || defaultValues.observacion || '',
        idVehiculo: defaultValues.idVehiculo || defaultValues.vehiculo?.idVehiculo || '',
      });
    } else if (open && mode === 'create') {
      form.reset({
        fechaInicio: '',
        fechaFin: '',
        tipo: '',
        observacion: '',
        idVehiculo: '',
      });
    }
  }, [open, defaultValues, mode, form]);

  const handleSubmit = async (data) => {
    // Convertir idVehiculo a número
    const payload = {
      ...data,
      idVehiculo: parseInt(data.idVehiculo, 10),
    };

    const result = await onSubmit(payload);
    if (result?.success) {
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Crear Mantenimiento' : 'Editar Mantenimiento'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Completa los datos para crear un nuevo mantenimiento.' : 'Modifica los datos del mantenimiento.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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

            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Mantenimiento</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Preventivo">Preventivo</SelectItem>
                      <SelectItem value="Correctivo">Correctivo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        <SelectValue placeholder={loadingVehiculos ? "Cargando vehículos..." : "Seleccione un vehículo"} />
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

            <FormField
              control={form.control}
              name="observacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Ingrese observaciones adicionales..." 
                      className="resize-none"
                      rows={4}
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