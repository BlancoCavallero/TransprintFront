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
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { getViajeSchema } from './viajeSchema';
import { useChofer } from '../../hooks/entities/useChofer';
import { useVehiculo } from '../../hooks/entities/useVehiculo';
import { useCliente } from '../../hooks/entities/useCliente';
import { useLocalidad } from '../../hooks/entities/useLocalidad';

export const ViajeForm = ({ open, onOpenChange, onSubmit, defaultValues, isLoading = false, mode = 'create' }) => {
  const schema = getViajeSchema(mode);
  const { choferes, loading: loadingChoferes } = useChofer({ estado: 'Habilitado' });
  const { vehiculos, loading: loadingVehiculos } = useVehiculo({ estado: 'Habilitado' });
  const { clientes, loading: loadingClientes } = useCliente();
  const { localidades, loading: loadingLocalidades } = useLocalidad();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      idChofer: '',
      idVehiculo: '',
      idCliente: '',
      idLocalidadOrigen: '',
      idLocalidadDestino: '',
      fechaInicio: '',
      fechaFin: '',
      kilometros: '',
      precio: '',
      observaciones: '',
      estado: '',
      motivoCancelacion: '',
    },
  });

  const watchEstado = form.watch('estado');

  useEffect(() => {
    if (open && defaultValues && mode === 'edit') {
      form.reset({
        idChofer: defaultValues.idChofer?.toString() || '',
        idVehiculo: defaultValues.idVehiculo?.toString() || '',
        idCliente: defaultValues.idCliente?.toString() || '',
        idLocalidadOrigen: defaultValues.idLocalidadOrigen?.toString() || '',
        idLocalidadDestino: defaultValues.idLocalidadDestino?.toString() || '',
        fechaInicio: defaultValues.fechaInicio?.split('T')[0] || '',
        fechaFin: defaultValues.fechaFin?.split('T')[0] || '',
        kilometros: defaultValues.kilometros || '',
        precio: defaultValues.precio || '',
        observaciones: defaultValues.observaciones || '',
        estado: '',
        motivoCancelacion: defaultValues.motivoCancelacion || '',
      });
    } else if (open && mode === 'create') {
      form.reset({
        idChofer: '',
        idVehiculo: '',
        idCliente: '',
        idLocalidadOrigen: '',
        idLocalidadDestino: '',
        fechaInicio: '',
        fechaFin: '',
        kilometros: '',
        precio: '',
        observaciones: '',
        estado: '',
        motivoCancelacion: '',
      });
    }
  }, [open, defaultValues, mode, form]);

  const handleSubmit = async (data) => {
    const payload = { ...data };
    if (mode === 'edit' && !data.estado) {
      delete payload.estado;
      delete payload.motivoCancelacion;
    }
    const result = await onSubmit(payload);
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
      <DialogContent 
        className="max-w-[600px] max-h-[85vh] overflow-y-auto"
        style={{ 
          padding: '30px',
          marginTop: '40px', // Despegue del Header
          marginBottom: '20px' 
        }}
      >
        <DialogHeader style={{ marginBottom: '20px' }}>
          <DialogTitle className="text-xl font-bold">
            {mode === 'create' ? 'Crear Nuevo Viaje' : 'Editar Viaje'}
          </DialogTitle>
          <DialogDescription>
            Complete los datos para la gestión del servicio de transporte.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* CLIENTE - Fila completa para prioridad */}
            <FormField
              control={form.control}
              name="idCliente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-sm text-slate-700">Cliente</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger style={inputStyle}>
                        <SelectValue placeholder={loadingClientes ? "Cargando..." : "Seleccione un cliente"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clientes.map((c) => (
                        <SelectItem key={c.idCliente} value={c.idCliente.toString()}>
                          {c.razonSocial || `${c.persona?.nombre} ${c.persona?.apellido}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CHOFER Y VEHÍCULO - Acomodados juntos */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <FormField
                control={form.control}
                name="idChofer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-sm text-slate-700">Chofer Asignado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger style={inputStyle}>
                          <SelectValue placeholder={loadingChoferes ? "..." : "Seleccione chofer"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {choferes.map((c) => (
                          <SelectItem key={c.idChofer} value={c.idChofer.toString()}>
                            {c.persona?.nombre} {c.persona?.apellido}
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
                name="idVehiculo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-sm text-slate-700">Vehículo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger style={inputStyle}>
                          <SelectValue placeholder={loadingVehiculos ? "..." : "Seleccione unidad"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehiculos.map((v) => (
                          <SelectItem key={v.idVehiculo} value={v.idVehiculo.toString()}>
                            {v.patente} - {v.marca}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ORIGEN Y DESTINO */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <FormField
                control={form.control}
                name="idLocalidadOrigen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-sm text-slate-700">Origen</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger style={inputStyle}>
                          <SelectValue placeholder="Ciudad origen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {localidades.map((l) => (
                          <SelectItem key={l.idLocalidad} value={l.idLocalidad.toString()}>{l.localidad}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="idLocalidadDestino"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-sm text-slate-700">Destino</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger style={inputStyle}>
                          <SelectValue placeholder="Ciudad destino" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {localidades.map((l) => (
                          <SelectItem key={l.idLocalidad} value={l.idLocalidad.toString()}>{l.localidad}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {/* FECHAS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <FormField
                control={form.control}
                name="fechaInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-sm text-slate-700">Fecha Inicio</FormLabel>
                    <FormControl><Input type="date" style={inputStyle} {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fechaFin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-sm text-slate-700">Fecha Fin</FormLabel>
                    <FormControl><Input type="date" style={inputStyle} {...field} /></FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* KM Y PRECIO */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <FormField
                control={form.control}
                name="kilometros"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-sm text-slate-700">Kilómetros</FormLabel>
                    <FormControl><Input type="number" placeholder="0" style={inputStyle} {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="precio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-sm text-slate-700">Precio ($)</FormLabel>
                    <FormControl><Input type="number" placeholder="0.00" style={inputStyle} {...field} /></FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* ESTADO ESPECIAL (Solo edición) */}
            {mode === 'edit' && (
              <div style={{ padding: '15px', backgroundColor: '#fff1f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-xs uppercase text-red-600">Estado de Viaje</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger style={{ ...inputStyle, backgroundColor: 'white' }}>
                            <SelectValue placeholder="Sin cambios" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CANCELADO">MARCAR COMO CANCELADO</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                {watchEstado === 'CANCELADO' && (
                  <FormField
                    control={form.control}
                    name="motivoCancelacion"
                    render={({ field }) => (
                      <FormItem style={{ marginTop: '10px' }}>
                        <FormLabel className="font-bold text-xs">Motivo de Cancelación</FormLabel>
                        <FormControl>
                          <Input style={inputStyle} placeholder="Explique el motivo..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-sm text-slate-700">Observaciones</FormLabel>
                  <FormControl>
                    <Textarea 
                      style={{ borderRadius: '8px', border: '1px solid #cbd5e1' }}
                      placeholder="Notas del viaje..." 
                      className="resize-none"
                      rows={2}
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter style={{ marginTop: '10px', gap: '12px' }}>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                style={{ height: '40px', padding: '0 20px' }}
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