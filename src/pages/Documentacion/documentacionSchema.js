import { z } from 'zod';

// Tipos de documentación según la entidad
export const TIPOS_DOC_CHOFER = ['APTO FISICO', 'CARNET DE CONDUCIR', 'OTRO'];
export const TIPOS_DOC_VEHICULO = ['VTV', 'SEGURO', 'OTRO'];

export const getDocumentacionSchema = (tipoEntidad) => {
  const tiposValidos = tipoEntidad === 'CHOFER' ? TIPOS_DOC_CHOFER : TIPOS_DOC_VEHICULO;
  
  return z.object({
    nombre: z
      .string()
      .min(1, { message: 'El tipo de documentación es obligatorio' })
      .refine((val) => tiposValidos.includes(val), {
        message: `Debe seleccionar un tipo válido: ${tiposValidos.join(', ')}`,
      }),
    detalle: z
      .any()
      .refine(
        (file) => file instanceof File || file === null,
        'Debe adjuntar un archivo válido'
      ),
    renovacion: z.coerce
      .number({ invalid_type_error: 'Debe ingresar un número' })
      .int({ message: 'La renovación debe ser un número entero' })
      .positive({ message: 'La renovación debe ser mayor a 0' })
      .optional()
      .or(z.literal('')),
    fechaVencimiento: z
      .string()
      .min(1, { message: 'La fecha de vencimiento es obligatoria' })
      .refine((date) => {
        const parsed = new Date(date);
        return !isNaN(parsed.getTime());
      }, {
        message: 'Formato de fecha inválido',
      }),
  });
};
