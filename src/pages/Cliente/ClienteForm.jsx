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
  isLoading = false,
  mode = 'create',
}) => {
  const schema = getClienteSchema(mode);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      correo: '',
      razonSocial: '',
      tipo: 'Productor',
      nombre: '',
      apellido: '',
      cuit: '',
      telefono: '',
      idLocalidad: undefined,
      observaciones: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && defaultValues) {
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
      } else {
        form.reset({
          correo: '',
          razonSocial: '',
          tipo: 'Productor',
          nombre: '',
          apellido: '',
          cuit: '',
          telefono: '',
          idLocalidad: undefined,
          observaciones: '',
        });
      }
    }
  }, [open, defaultValues, mode, form]);

  // Aplicamos la lógica de ChoferForm: esperar el result.success para cerrar
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
      <DialogContent style={{ padding: '30px', maxWidth: '550px' }} className="max-h-[90vh] overflow-y-auto">
        <DialogHeader style={{ marginBottom: '20px' }}>
          <DialogTitle className="text-xl font-bold">
            {mode === 'create' ? 'Crear Nuevo Cliente' : 'Editar Cliente'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Completa los datos para crear un nuevo cliente.' 
              : 'Modifica los datos del cliente.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <FormField control={form.control} name="nombre" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-sm">Nombre</FormLabel>
                  <FormControl><Input style={inputStyle} placeholder="Jorge" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="apellido" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-sm">Apellido</FormLabel>
                  <FormControl><Input style={inputStyle} placeholder="Perez" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="correo" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-sm">Email</FormLabel>
                <FormControl><Input style={inputStyle} placeholder="ejemplo@correo.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="razonSocial" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-sm">Razón Social</FormLabel>
                <FormControl><Input style={inputStyle} placeholder="Empresa S.A." {...field} /></FormControl>
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
                  <FormControl><Input style={inputStyle} placeholder="20409873460" maxLength={11} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="telefono" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-sm">Teléfono</FormLabel>
                  <FormControl><Input style={inputStyle} placeholder="1123456789" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="idLocalidad" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-sm">Localidad</FormLabel>
                <Select onValueChange={(v) => field.onChange(parseInt(v, 10))} value={field.value ? String(field.value) : undefined}>
                  <FormControl>
                    <SelectTrigger style={inputStyle}>
                      <SelectValue placeholder="Selecciona localidad" />
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
                <FormLabel className="font-bold text-sm">Observaciones</FormLabel>
                <FormControl>
                  <Textarea style={{ ...inputStyle, height: '80px', paddingTop: '10px' }} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

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