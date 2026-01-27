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
import { getClienteSchema } from './clienteSchema';

export const ClienteForm = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  localidades = [],
  loadingLocalidades = false,
  isLoading = false,
  mode = 'create',
}) => {
  const schema = getClienteSchema(mode);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      correo: '',
      razonSocial: '',
      tipo: 'Particular',
      nombre: '',
      apellido: '',
      cuit: '',
      telefono: '',
      idLocalidad: undefined,
      observaciones: '',
    },
  });

  useEffect(() => {
    if (open && defaultValues && mode === 'edit') {
      form.reset({
        correo: defaultValues.correo || '',
        razonSocial: defaultValues.razonSocial || '',
        tipo: defaultValues.tipo || 'Particular',
        nombre: defaultValues.persona?.nombre || defaultValues.nombre || '',
        apellido: defaultValues.persona?.apellido || defaultValues.apellido || '',
        cuit: String(defaultValues.persona?.cuit || defaultValues.cuit || ''),
        telefono: String(defaultValues.persona?.telefono || defaultValues.telefono || ''),
        idLocalidad: defaultValues.idLocalidad || undefined,
        observaciones: defaultValues.observaciones || '',
      });
    } else if (open && mode === 'create') {
      form.reset({
        correo: '',
        razonSocial: '',
        tipo: 'Particular',
        nombre: '',
        apellido: '',
        cuit: '',
        telefono: '',
        idLocalidad: undefined,
        observaciones: '',
      });
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apellido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="correo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="contacto@empresa.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="razonSocial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razón Social</FormLabel>
                  <FormControl>
                    <Input placeholder="Transporte ABC S.A." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Cliente</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Particular">Particular</SelectItem>
                        <SelectItem value="Empresa">Empresa</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cuit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CUIT</FormLabel>
                    <FormControl>
                      <Input placeholder="20123456789" maxLength={11} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="1187654321" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="idLocalidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localidad</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value, 10))}
                      value={field.value ? String(field.value) : undefined}
                      disabled={loadingLocalidades}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={loadingLocalidades ? "Cargando localidades..." : "Selecciona una localidad"} />
                      </SelectTrigger>
                      <SelectContent>
                        {localidades.map((loc) => (
                          <SelectItem
                            key={loc.idLocalidad}
                            value={String(loc.idLocalidad)}
                          >
                            {loc.localidad} - {loc.provincia} {loc.codPostal ? `(CP: ${loc.codPostal})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notas adicionales sobre el cliente..."
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