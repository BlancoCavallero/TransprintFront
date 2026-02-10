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
import { Loader2, UserPlus } from 'lucide-react'; // Agregué UserPlus para el título
import { useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getUsuarioSchema } from './usuarioSchema';
import { PasswordRequirements } from './PasswordRequirements';

export const UsuarioForm = ({ open, onOpenChange, onSubmit, defaultValues, isLoading = false, mode = 'create' }) => {
  const schema = getUsuarioSchema(mode);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      nombre_completo: '',
      role: 'Empleado',
    },
  });

  useEffect(() => {
    if (open && defaultValues && mode === 'edit') {
      form.reset({
        username: defaultValues.username || '',
        email: defaultValues.email || '',
        password: '',
        nombre_completo: defaultValues.nombre_completo || '',
        role: defaultValues.role || defaultValues.roles?.[0] || 'Empleado',
      });
    } else if (open && mode === 'create') {
      form.reset({
        username: '',
        email: '',
        password: '',
        nombre_completo: '',
        role: 'Empleado',
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

  // Estilos traídos de ClienteForm para uniformidad
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
          maxWidth: '525px',
        }} 
        className="max-h-[85vh] overflow-y-auto"
      >
        <DialogHeader style={{ marginBottom: '20px' }}>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <UserPlus className="h-5 w-5" style={{ color: '#592673' }} />
            {mode === 'create' ? 'Crear Usuario' : 'Editar Usuario'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Completa los datos para dar de alta un nuevo usuario en el sistema.' 
              : 'Modifica los datos de acceso y perfil del usuario.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            <FormField
              control={form.control}
              name="nombre_completo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-sm">Nombre completo</FormLabel>
                  <FormControl>
                    <Input style={inputStyle} placeholder="Juan Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-sm">Usuario</FormLabel>
                    <FormControl>
                      <Input style={inputStyle} placeholder="juan123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-sm">Rol</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger style={inputStyle}>
                          <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Empleado">Empleado</SelectItem>
                        <SelectItem value="Administrador">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-sm">Email</FormLabel>
                  <FormControl>
                    <Input style={inputStyle} placeholder="juan@ejemplo.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-sm">Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      style={inputStyle}
                      placeholder={mode === 'create' ? 'Ingresa una contraseña' : 'Deja en blanco para no cambiarla'}
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mode === 'create' && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <PasswordRequirements password={form.watch('password')} />
              </div>
            )}

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