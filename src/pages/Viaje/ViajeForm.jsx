import { useForm } from 'react-hook-form';
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
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export const ViajeForm = ({ open, onOpenChange, onSubmit, defaultValues, isLoading = false, mode = 'create' }) => {
  const form = useForm({
    defaultValues: {
      origen: '',
      destino: '',
      fechaSalida: '',
      fechaLlegada: '',
      choferId: null,
      vehiculoId: null,
    },
  });

  useEffect(() => {
    if (open && defaultValues && mode === 'edit') {
      form.reset({
        origen: defaultValues.origen || '',
        destino: defaultValues.destino || '',
        fechaSalida: defaultValues.fechaSalida || '',
        fechaLlegada: defaultValues.fechaLlegada || '',
        choferId: defaultValues.choferId || null,
        vehiculoId: defaultValues.vehiculoId || null,
      });
    } else if (open && mode === 'create') {
      form.reset({ origen: '', destino: '', fechaSalida: '', fechaLlegada: '', choferId: null, vehiculoId: null });
    }
  }, [open, defaultValues, mode, form]);

  const handleSubmit = async (data) => {
    const result = await onSubmit(data);
    if (result?.success) {
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Crear Viaje' : 'Editar Viaje'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Completa los datos para crear un nuevo viaje.' : 'Modifica los datos del viaje.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField control={form.control} name="origen" rules={{ required: 'El origen es requerido' }} render={({ field }) => (
              <FormItem>
                <FormLabel>Origen</FormLabel>
                <FormControl>
                  <Input placeholder="Ciudad A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="destino" rules={{ required: 'El destino es requerido' }} render={({ field }) => (
              <FormItem>
                <FormLabel>Destino</FormLabel>
                <FormControl>
                  <Input placeholder="Ciudad B" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="fechaSalida" rules={{ required: 'La fecha de salida es requerida' }} render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Salida</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="fechaLlegada" rules={{ required: 'La fecha de llegada es requerida' }} render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Llegada</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="choferId" rules={{}} render={({ field }) => (
              <FormItem>
                <FormLabel>Chofer ID</FormLabel>
                <FormControl>
                  <Input placeholder="1" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="vehiculoId" rules={{}} render={({ field }) => (
              <FormItem>
                <FormLabel>Vehículo ID</FormLabel>
                <FormControl>
                  <Input placeholder="1" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancelar</Button>
              <Button type="submit" disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {mode === 'create' ? 'Crear' : 'Guardar'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};