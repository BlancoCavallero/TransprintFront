import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { getGastoSchema } from './gastoSchema';

export const GastoForm = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isLoading = false,
  mode = 'create',
  idViaje, // ID del viaje al que pertenece el gasto
}) => {
  const schema = getGastoSchema(mode);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      detalle: '',
      monto: 0, // Mantener como número, no cadena vacía
      tipo: '',
      idViaje: idViaje || '',
    },
  });

  useEffect(() => {
    if (open && defaultValues && mode === 'edit') {
      form.reset({
        detalle: defaultValues.detalle || '',
        monto: defaultValues.monto || 0,
        tipo: defaultValues.tipo || '',
        idViaje: defaultValues.idViaje || idViaje || '',
      });
    } else if (open && mode === 'create') {
      form.reset({
        detalle: '',
        monto: 0,
        tipo: '',
        idViaje: idViaje || '',
      });
    }
  }, [open, defaultValues, mode, form, idViaje]);

  const handleSubmit = async (data) => {
    const payload = {
      ...data,
      monto: parseFloat(data.monto),
      idViaje: parseInt(data.idViaje, 10),
    };

    const result = await onSubmit(payload);
    if (result?.success) {
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Registrar Gasto' : 'Editar Gasto'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Completa los datos para registrar un nuevo gasto.' : 'Modifica los datos del gasto.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Gasto</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Combustible">Combustible</SelectItem>
                      <SelectItem value="Peaje">Peaje</SelectItem>
                      <SelectItem value="Viatico">Viático</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Ej: 100.50" 
                      {...field}
                      value={field.value === 0 ? '' : field.value}
                      onChange={(e) => field.onChange(e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="detalle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalle</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ej: Comida, Carga de combustible..." 
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
                    {mode === 'create' ? 'Registrando...' : 'Actualizando...'}
                  </>
                ) : (
                  mode === 'create' ? 'Registrar' : 'Actualizar'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
