import * as z from "zod";

/**
 * Schema de validación para crear/editar choferes
 * Utiliza Zod para validar los datos del formulario
 */

export const createChoferSchema = z.object({
  dni: z
    .number({
      required_error: "El DNI es requerido",
      invalid_type_error: "El DNI debe ser un número",
    })
    .int("El DNI debe ser un número entero")
    .positive("El DNI debe ser positivo")
    .min(1000000, "El DNI debe tener al menos 7 dígitos")
    .max(99999999, "El DNI no puede exceder 8 dígitos"),

  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .regex(
      /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/,
      "El nombre solo puede contener letras y espacios",
    ),

  apellido: z
    .string()
    .min(1, "El apellido es requerido")
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(100, "El apellido no puede exceder 100 caracteres")
    .regex(
      /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/,
      "El apellido solo puede contener letras y espacios",
    ),

  cuit: z
    .string()
    .min(1, "El CUIT es requerido")
    .regex(/^[0-9]{11}$/, "El CUIT debe tener exactamente 11 dígitos")
    .refine((val) => !isNaN(Number(val)), "El CUIT debe contener solo números"),

  telefono: z
    .string()
    .min(1, "El teléfono es requerido")
    .min(8, "El teléfono debe tener al menos 8 dígitos")
    .max(20, "El teléfono no puede exceder 20 caracteres")
    .regex(
      /^[0-9\s\-\+\(\)]+$/,
      "El teléfono solo puede contener números, espacios, guiones, + y paréntesis",
    ),
});

/**
 * Schema para editar chofer (mismo que crear)
 */
export const editChoferSchema = createChoferSchema;

/**
 * Schema dinámico: usa create o edit según el modo
 */
export const getChoferSchema = (mode) => {
  return mode === "create" ? createChoferSchema : editChoferSchema;
};
