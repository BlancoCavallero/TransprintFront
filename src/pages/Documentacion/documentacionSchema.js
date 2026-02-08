import { z } from 'zod';

// Tipos de documentación según la entidad
export const TIPOS_DOC_CHOFER = ['APTO FISICO', 'CARNET DE CONDUCIR', 'OTRO'];
export const TIPOS_DOC_VEHICULO = ['VTV', 'SEGURO', 'OTRO'];

// Validación de archivo PDF
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPE = 'application/pdf';

export const getDocumentacionSchema = (tipoEntidad, mode = 'create') => {
  const tiposValidos = tipoEntidad === 'CHOFER' ? TIPOS_DOC_CHOFER : TIPOS_DOC_VEHICULO;
  
  const baseSchema = {
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
  };

  // Para crear: archivo es obligatorio
  if (mode === 'create') {
    return z.object({
      ...baseSchema,
      detalle: z
        .instanceof(File, { message: 'Debe seleccionar un archivo PDF' })
        .refine((file) => file.size <= MAX_FILE_SIZE, {
          message: 'El archivo no debe superar los 5MB',
        })
        .refine((file) => file.type === ACCEPTED_FILE_TYPE, {
          message: 'Solo se permiten archivos PDF',
        }),
    });
  }

  // Para editar: archivo es opcional (si no se selecciona, se mantiene el actual)
  return z.object({
    ...baseSchema,
    detalle: z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: 'El archivo no debe superar los 5MB',
      })
      .refine((file) => file.type === ACCEPTED_FILE_TYPE, {
        message: 'Solo se permiten archivos PDF',
      })
      .optional()
      .or(z.literal('')),
  });
};
