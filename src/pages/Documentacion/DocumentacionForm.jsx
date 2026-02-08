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
import { FileText, Eye } from 'lucide-react';
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
      detalle: undefined, // No establecer valor por defecto para el archivo
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
          detalle: undefined, // Archivo debe ser seleccionado, no string vacío
          renovacion: '',
          fechaVencimiento: '',
        });
      } else if (defaultValues) {
        form.reset({
          nombre: defaultValues.nombre || '',
          detalle: undefined, // No establecemos el archivo aquí en edición tampoco
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
    console.log('=== handleFileChange ===');
    console.log('Archivo seleccionado:', file);
    if (file) {
      field.onChange(file);
      setSelectedFileName(file.name);
      console.log('Archivo establecido en el form');
    } else {
      console.log('No se seleccionó archivo');
    }
  };

  const handleViewCurrentPDF = () => {
    if (defaultValues?.detalle) {
      // Construir URL completa del archivo
      const fileUrl = defaultValues.detalle.startsWith('http') 
        ? defaultValues.detalle 
        : `${backend_url}${defaultValues.detalle}`;
      window.open(fileUrl, '_blank');
    }
  };

  const handleSubmit = async (data) => {
    
      if (mode === 'create' && !data.detalle) {
    form.setError('detalle', {
      type: 'manual',
      message: 'Debe adjuntar un archivo',
    });
    return;
  }
    // Crear FormData para enviar archivo
    const formData = new FormData();
    
    formData.append('nombre', data.nombre);
    
    // Solo agregar renovacion si tiene valor
    if (data.renovacion) {
      formData.append('renovacion', data.renovacion);
    }
    
    formData.append('fechaVencimiento', data.fechaVencimiento);
    formData.append('tipoEntidad', tipoEntidad);

    if (tipoEntidad === 'CHOFER') {
      formData.append("idChofer", idEntidad);
    } else {
      formData.append("idVehiculo", idEntidad);
    }

    // 👇 SOLO si hay archivo nuevo
    if (data.detalle instanceof File) {
      formData.append("detalle", data.detalle);
      formData.append('idChofer', idEntidad);
    } else if (tipoEntidad === 'VEHICULO') {
      formData.append('idVehiculo', idEntidad);
    }

    // Agregar archivo SOLO si realmente se seleccionó uno y es un File
    if (data.detalle && data.detalle instanceof File) {
      console.log('Agregando archivo al FormData:', data.detalle.name);
      formData.append('detalle', data.detalle);
    } else {
      console.log('NO se agregó archivo - mode:', mode);
    }
    // NO agregar detalle si no hay archivo - esto evita enviar objetos vacíos
    
    // Log del FormData
    console.log('=== CONTENIDO DEL FORMDATA ===');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    const result = await onSubmit(formData);
    if (result?.success) {
      form.reset();
      setSelectedFileName('');
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
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Archivo PDF *</FormLabel>
                  {mode === 'edit' && defaultValues?.detalle && (
                    <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-700">Archivo actual guardado</span>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={handleViewCurrentPDF}
                        className="h-8 px-2 hover:bg-blue-100"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver PDF
                      </Button>
                    </div>
                  )}
                  <FormControl>
                    <Input
                      type="file"
                      accept="application/pdf"
                      disabled={isLoading}
                      onChange={(e) => handleFileChange(e, { onChange })}
                      {...fieldProps}
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
                  {selectedFileName && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {selectedFileName}
                    </p>
                  )}
                  {mode === 'edit' && (
                    <p className="text-xs text-muted-foreground">
                      Deje vacío para mantener el archivo actual
                    </p>
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
