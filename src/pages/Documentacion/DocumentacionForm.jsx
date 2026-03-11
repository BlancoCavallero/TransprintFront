import { useEffect, useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Eye, Loader2 } from 'lucide-react';
import { getDocumentacionSchema, TIPOS_DOC_CHOFER, TIPOS_DOC_VEHICULO } from './documentacionSchema';
import { backend_url } from '@/configuration/app.config';

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
  const schema = getDocumentacionSchema(tipoEntidad, mode);
  const [selectedFileName, setSelectedFileName] = useState('');

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: '',
      detalle: undefined,
      renovacion: '',
      fechaVencimiento: '',
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (open) {
      setSelectedFileName('');
      if (mode === 'create') {
        form.reset({
          nombre: '',
          detalle: undefined,
          renovacion: '',
          fechaVencimiento: '',
        });
      } else if (defaultValues) {
        form.reset({
          nombre: defaultValues.nombre || '',
          detalle: undefined,
          renovacion: defaultValues.renovacion || '',
          fechaVencimiento: defaultValues.fechaVencimiento
            ? new Date(defaultValues.fechaVencimiento.split('/').reverse().join('-'))
                .toISOString()
                .split('T')[0]
            : '',
        });
      }
    }
  }, [open, mode, defaultValues, form]);

  const handleFileChange = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      field.onChange(file);
      setSelectedFileName(file.name);
    }
  };

  const handleViewCurrentPDF = () => {
    if (defaultValues?.detalle) {
      const fileUrl = defaultValues.detalle.startsWith('http') 
        ? defaultValues.detalle 
        : `${backend_url}${defaultValues.detalle}`;
      window.open(fileUrl, '_blank');
    }
  };

  const handleSubmit = async (data) => {
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    if (data.renovacion) {
      formData.append('renovacion', data.renovacion);
    }
    formData.append('fechaVencimiento', data.fechaVencimiento);
    formData.append('tipoEntidad', tipoEntidad);

    if (tipoEntidad === 'CHOFER') {
      formData.append('idChofer', idEntidad);
    } else if (tipoEntidad === 'VEHICULO') {
      formData.append('idVehiculo', idEntidad);
    }

    if (data.detalle && data.detalle instanceof File) {
      formData.append('detalle', data.detalle);
    }

    const result = await onSubmit(formData);
    if (result?.success) {
      form.reset();
      setSelectedFileName('');
    }
  };

  // --- ESTILOS COPIADOS DE CHOFERFORM ---
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
            {mode === 'create' ? 'Registrar Documentación' : 'Editar Documentación'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Complete los campos para registrar una nueva documentación.'
              : 'Modifique los campos necesarios.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-sm">Tipo de Documentación *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger style={inputStyle} className="w-full">
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
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel className="font-bold text-sm">Archivo PDF *</FormLabel>
                  {mode === 'edit' && defaultValues?.detalle && (
                    <div className="mb-2 p-2 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-600" />
                        <span className="text-xs text-slate-600 font-medium">Documento actual</span>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={handleViewCurrentPDF}
                        className="h-7 px-2 hover:bg-slate-200 text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver PDF
                      </Button>
                    </div>
                  )}
                  <FormControl>
                    <Input
                      type="file"
                      accept="application/pdf"
                      disabled={isLoading}
                      style={{ ...inputStyle, padding: '8px 15px' }} // Ajuste leve para el tipo file
                      onChange={(e) => handleFileChange(e, { onChange })}
                      {...fieldProps}
                    />
                  </FormControl>
                  {selectedFileName && (
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 font-medium">
                      <FileText className="h-3 w-3" />
                      Seleccionado: {selectedFileName}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <FormField
                control={form.control}
                name="renovacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-sm">Renovación (meses)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ej: 12"
                        disabled={isLoading}
                        style={inputStyle}
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
                    <FormLabel className="font-bold text-sm">Vencimiento</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={isLoading}
                        style={inputStyle}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                {mode === 'create' ? 'Registrar' : 'Guardar Cambios'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};