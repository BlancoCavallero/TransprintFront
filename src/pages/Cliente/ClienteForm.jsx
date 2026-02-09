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
      correo: '', razonSocial: '', tipo: 'Productor', nombre: '',
      apellido: '', cuit: '', telefono: '', idLocalidad: undefined, observaciones: '',
    },
  });

  useEffect(() => {
    if (open && defaultValues && mode === 'edit') {
      form.reset({
        correo: defaultValues.correo || '',
        razonSocial: defaultValues.razonSocial || '',
        tipo: defaultValues.tipo || 'Productor',
        nombre: defaultValues.persona?.nombre || defaultValues.nombre || '',
        apellido: defaultValues.persona?.apellido || defaultValues.apellido || '',
        cuit: String(defaultValues.persona?.cuit || defaultValues.cuit || ''),
        telefono: String(defaultValues.persona?.telefono || defaultValues.telefono || ''),
        idLocalidad: defaultValues.idLocalidad || undefined,
        observaciones: defaultValues.observaciones || '',
      });
    } else if (open && mode === 'create') {
      form.reset({
        correo: '', razonSocial: '', tipo: 'Productor', nombre: '',
        apellido: '', cuit: '', telefono: '', idLocalidad: undefined, observaciones: '',
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

  const inputStyle = {
    paddingLeft: '15px',
    paddingRight: '15px',
    height: '42px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ padding: '30px', maxWidth: '550px' }} className="max-h-[85vh] overflow-y-auto">
        <DialogHeader style={{ marginBottom: '20px' }}>
          <DialogTitle className="text-xl font-bold">
            {mode === 'create' ? 'Crear Nuevo Cliente' : 'Editar Cliente'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Ingresa los datos del nuevo cliente.' : 'Modifica los datos del cliente.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <FormField control={form.control} name="nombre" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-sm">Nombre</FormLabel>
                  <FormControl><Input style={inputStyle} placeholder="Juan" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="apellido" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-sm">Apellido</FormLabel>
                  <FormControl><Input style={inputStyle} placeholder="Pérez" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="correo" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-sm">Email</FormLabel>
                <FormControl><Input style={inputStyle} placeholder="contacto@empresa.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="razonSocial" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-sm">Razón Social</FormLabel>
                <FormControl><Input style={inputStyle} placeholder="Transporte ABC S.A." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="tipo" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-sm">Tipo de Cliente</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger style={inputStyle}>
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Productor">Productor</SelectItem>
                    <SelectItem value="Empresa">Empresa</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <FormField control={form.control} name="cuit" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-sm">CUIT</FormLabel>
                  <FormControl><Input style={inputStyle} placeholder="20123456789" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="telefono" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-sm">Teléfono</FormLabel>
                  <FormControl><Input style={inputStyle} placeholder="1187654321" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="idLocalidad" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-sm">Localidad</FormLabel>
                <Select onValueChange={(value) => field.onChange(parseInt(value, 10))} value={field.value ? String(field.value) : undefined}>
                  <FormControl>
                    <SelectTrigger style={inputStyle}>
                      <SelectValue placeholder="Selecciona una localidad" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {localidades.map((loc) => (
                      <SelectItem key={loc.idLocalidad} value={String(loc.idLocalidad)}>
                        {loc.localidad} - {loc.provincia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="observaciones" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-sm">Observaciones (Opcional)</FormLabel>
                <FormControl>
                  <Textarea style={{ ...inputStyle, height: '80px', paddingTop: '10px' }} placeholder="Notas adicionales..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter style={{ marginTop: '10px', display: 'flex', gap: '12px' }}>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}
                style={{ height: '40px', padding: '0 20px', border: '1px solid #cbd5e1' }}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}
                style={{ height: '40px', padding: '0 25px', backgroundColor: '#592673', color: 'white', border: 'none' }}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === 'create' ? 'Crear' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};