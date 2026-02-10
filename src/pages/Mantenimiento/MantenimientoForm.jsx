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
import { Loader2, Wrench } from 'lucide-react'; // Agregué Wrench para coherencia visual
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
          maxWidth: '550px',
        }} 
        className="max-h-[85vh] overflow-y-auto"
      >
        <DialogHeader style={{ marginBottom: '20px' }}>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Wrench className="h-5 w-5" style={{ color: '#592673' }} />
            {mode === 'create' ? 'Crear Mantenimiento' : 'Editar Mantenimiento'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Completa los datos para registrar un nuevo servicio técnico.' 
              : 'Modifica los datos del registro de mantenimiento.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <FormField
                control={form.control}
                name="fechaInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-sm">Fecha de Inicio</FormLabel>
                    <FormControl>
                      <Input type="date" style={inputStyle} {...field} />
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
                    <FormLabel className="font-bold text-sm">Fecha de Fin</FormLabel>
                    <FormControl>
                      <Input type="date" style={inputStyle} {...field} />
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
                  <FormLabel className="font-bold text-sm">Tipo de Mantenimiento</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger style={inputStyle}>
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
                  <FormLabel className="font-bold text-sm">Vehículo</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value?.toString()}
                    disabled={loadingVehiculos}
                  >
                    <FormControl>
                      <SelectTrigger style={inputStyle}>
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
                  <FormLabel className="font-bold text-sm">Observaciones (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Ingrese detalles técnicos o piezas reemplazadas..." 
                      style={{ ...inputStyle, height: '80px', paddingTop: '10px', resize: 'none' }}
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
                {mode === 'create' ? 'Crear' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};