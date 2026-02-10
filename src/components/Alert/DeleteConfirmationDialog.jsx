import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, AlertTriangle } from 'lucide-react';

export const DeleteConfirmationDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  title = '¿Estás seguro?',
  description = 'Esta acción no se puede deshacer. El registro será eliminado permanentemente.',
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent 
        className="max-w-[450px]" 
        style={{ padding: '32px', borderRadius: '12px' }}
      >
        <AlertDialogHeader style={{ marginBottom: '16px' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-slate-900">
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-slate-500 text-sm leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter style={{ gap: '12px', marginTop: '8px' }}>
          <AlertDialogCancel 
            disabled={isLoading}
            style={{ 
              height: '42px', 
              borderRadius: '8px', 
              padding: '0 20px',
              border: '1px solid #cbd5e1'
            }}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
            style={{ 
              height: '42px', 
              borderRadius: '8px', 
              padding: '0 24px',
              fontWeight: '600'
            }}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar Eliminación
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};