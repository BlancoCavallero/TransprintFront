import { useForm } from "react-hook-form";
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

// Función auxiliar para formatear fecha a formato YYYY-MM-DD
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

// Función auxiliar para convertir fecha de input a ISO string
const formatDateToISO = (dateString) => {
  if (!dateString) return new Date().toISOString();
  const date = new Date(dateString + 'T00:00:00');
  return date.toISOString();
};

export const ClienteForm = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isLoading = false,
  mode = 'create', // 'create' o 'edit'
}) => {
  const form = useForm({
    defaultValues: {
      nombre: '',
      email: '',
      telefono: '',
      empresa: '',
      fechaCreacion: formatDateForInput(new Date().toISOString()),
    },
  });

  // Actualizar formulario cuando cambian los defaultValues (al editar)
  useEffect(() => {
    if (open && defaultValues && mode === 'edit') {
      form.reset({
        nombre: defaultValues.nombre || '',
        email: defaultValues.email || '',
        telefono: defaultValues.telefono || '',
        empresa: defaultValues.empresa || '',
        fechaCreacion: formatDateForInput(defaultValues.fechaCreacion) || formatDateForInput(new Date().toISOString()),
      });
    } else if (open && mode === 'create') {
      form.reset({
        nombre: '',
        email: '',
        telefono: '',
        empresa: '',
        fechaCreacion: formatDateForInput(new Date().toISOString()),
      });
    }
  }, [open, defaultValues, mode, form]);

  const handleSubmit = async (data) => {
    // Convertir la fecha a ISO string
    const dataWithFormattedDate = {
      ...data,
      fechaCreacion: formatDateToISO(data.fechaCreacion),
    };

    const result = await onSubmit(dataWithFormattedDate);
    if (result?.success) {
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Crear Nuevo Cliente' : 'Editar Cliente'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Completa los datos para crear un nuevo cliente.'
              : 'Modifica los datos del cliente.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              rules={{ 
                required: 'El nombre es requerido',
                minLength: {
                  value: 2,
                  message: 'El nombre debe tener al menos 2 caracteres'
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              rules={{
                required: 'El email es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido',
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="juan@ejemplo.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefono"
              rules={{ 
                required: 'El teléfono es requerido',
                minLength: {
                  value: 8,
                  message: 'El teléfono debe tener al menos 8 caracteres'
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="+54 11 1234-5678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="empresa"
              rules={{
                required: 'La empresa es requerida'
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="Empresa SRL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fechaCreacion"
              rules={{
                required: 'La fecha de creación es requerida'
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Creación</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
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
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'create' ? 'Crear' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};