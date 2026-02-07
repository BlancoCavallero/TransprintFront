import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { getDocumentacionSchema, TIPOS_DOC_CHOFER, TIPOS_DOC_VEHICULO } from './documentacionSchema';

export const DocumentacionForm = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isLoading,
  mode = 'create',
  tipoEntidad, // 'CHOFER' o 'VEHICULO'
  idEntidad, // idChofer o idVehiculo
}) => {
  const tiposDisponibles = tipoEntidad === 'CHOFER' ? TIPOS_DOC_CHOFER : TIPOS_DOC_VEHICULO;
  const schema = getDocumentacionSchema(tipoEntidad);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: '',
      detalle: null, 
      renovacion: '',
      fechaVencimiento: '',
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (!open) return;
      if (mode === 'create') {
        form.reset({
          nombre: '',
          detalle: null,
          renovacion: '',
          fechaVencimiento: '',
        });
      }

{mode === 'edit' && defaultValues?.detalle && (
  <a
    href={defaultValues.detalle}
    target="_blank"
    rel="noopener noreferrer"
    className="text-sm text-blue-600 underline"
  >
    Ver documento actual
  </a>
)}
    }, [open, mode, defaultValues, form]);

  const handleSubmit = async (data) => {
    
      if (mode === 'create' && !data.detalle) {
    form.setError('detalle', {
      type: 'manual',
      message: 'Debe adjuntar un archivo',
    });
    return;
  }
    const formData = new FormData();

    formData.append("nombre", data.nombre);
    formData.append("renovacion", data.renovacion);
    formData.append("fechaVencimiento", data.fechaVencimiento);
    formData.append("tipoEntidad", tipoEntidad);


    if (tipoEntidad === 'CHOFER') {
      formData.append("idChofer", idEntidad);
    } else {
      formData.append("idVehiculo", idEntidad);
    }

    // 👇 SOLO si hay archivo nuevo
    if (data.detalle instanceof File) {
      formData.append("detalle", data.detalle);
    }

    const result = await onSubmit(formData);
    if (result?.success) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Registrar Documentación' : 'Editar Documentación'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Complete los campos para registrar una nueva documentación'
              : 'Modifique los campos necesarios'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Documentación *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tiposDisponibles.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
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
              name="detalle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalle *</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*,application/pdf"
                      disabled={isLoading}
                      onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                    />
                  </FormControl>
                  {mode === 'edit' && defaultValues?.detalle && (
                    <a
                      href={defaultValues.detalle}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline mt-1 inline-block"
                    >
                      Ver documento actual
                    </a>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="renovacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Renovación (días) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ej: 365"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fechaVencimiento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Vencimiento *</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      disabled={isLoading}
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
                {isLoading ? 'Guardando...' : mode === 'create' ? 'Registrar' : 'Actualizar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
