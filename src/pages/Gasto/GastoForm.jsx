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
import { Loader2, Receipt } from 'lucide-react'; // Agregué Receipt para el icono del título
import { useEffect } from 'react';
import { getGastoSchema } from './gastoSchema';

export const GastoForm = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isLoading = false,
  mode = 'create',
  idViaje,
}) => {
  const schema = getGastoSchema(mode);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      detalle: '',
      monto: 0,
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

  // Estilos traídos de ClienteForm
  const inputStyle = {
    paddingLeft: '15px',
    paddingRight: '15px',
    height: '42px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        style={{ 
          padding: '30px', 
          maxWidth: '500px',
        }} 
        className="max-h-[85vh] overflow-y-auto"
      >
        <DialogHeader style={{ marginBottom: '20px' }}>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Receipt className="h-5 w-5" style={{ color: '#592673' }} />
            {mode === 'create' ? 'Registrar Gasto' : 'Editar Gasto'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Completa los datos para registrar un nuevo gasto en el viaje.' 
              : 'Modifica los datos del gasto registrado.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-sm">Tipo de Gasto</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger style={inputStyle}>
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
                  <FormLabel className="font-bold text-sm">Monto</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      style={inputStyle}
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
                  <FormLabel className="font-bold text-sm">Detalle</FormLabel>
                  <FormControl>
                    <Input 
                      style={inputStyle}
                      placeholder="Ej: Comida, Carga de combustible..." 
                      {...field} 
                    />
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
                {mode === 'create' ? 'Registrar' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};