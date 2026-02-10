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
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { getChoferSchema } from './choferSchema';

export const ChoferForm = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isLoading = false,
  mode = 'create',
}) => {
  const schema = getChoferSchema(mode);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      dni: undefined,
      nombre: '',
      apellido: '',
      cuit: '',
      telefono: '',
    },
  });

  useEffect(() => {
    if (open && defaultValues && mode === 'edit') {
      form.reset({
        dni: defaultValues.dni || undefined,
        nombre: defaultValues.persona?.nombre || defaultValues.nombre || '',
        apellido: defaultValues.persona?.apellido || defaultValues.apellido || '',
        cuit: String(defaultValues.persona?.cuit || defaultValues.cuit || ''),
        telefono: String(defaultValues.persona?.telefono || defaultValues.telefono || ''),
      });
    } else if (open && mode === 'create') {
      form.reset({
        dni: undefined,
        nombre: '',
        apellido: '',
        cuit: '',
        telefono: '',
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

  // Mismo estilo de input que ClienteForm
  const inputStyle = {
    paddingLeft: '15px',
    paddingRight: '15px',
    height: '42px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ padding: '30px', maxWidth: '525px' }}>
        <DialogHeader style={{ marginBottom: '20px' }}>
          <DialogTitle className="text-xl font-bold">
            {mode === 'create' ? 'Crear Nuevo Chofer' : 'Editar Chofer'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Completa los datos para crear un nuevo chofer.'
              : 'Modifica los datos del chofer.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            <FormField
              control={form.control}
              name="dni"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-sm">DNI</FormLabel>
                  <FormControl>
                    <Input 
                      style={inputStyle}
                      placeholder="40880194" 
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-sm">Nombre</FormLabel>
                    <FormControl>
                      <Input style={inputStyle} placeholder="Jorge" {...field} />
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
                    <FormLabel className="font-bold text-sm">Apellido</FormLabel>
                    <FormControl>
                      <Input style={inputStyle} placeholder="Perez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cuit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-sm">CUIT</FormLabel>
                  <FormControl>
                    <Input style={inputStyle} placeholder="20409873460" maxLength={11} {...field} />
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
                  <FormLabel className="font-bold text-sm">Teléfono</FormLabel>
                  <FormControl>
                    <Input style={inputStyle} placeholder="1123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter style={{ marginTop: '10px', gap: '12px' }}>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                style={{ height: '40px', padding: '0 20px', border: '1px solid #cbd5e1' }}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                style={{ height: '40px', padding: '0 25px', backgroundColor: '#592673', color: 'white' }}
              >
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