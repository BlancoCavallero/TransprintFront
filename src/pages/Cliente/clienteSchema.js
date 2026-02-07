import * as z from "zod";

/**
 * Schema de validación para crear/editar clientes
 * Utiliza Zod para validar los datos del formulario
 */

export const createClienteSchema = z.object({
  correo: z
    .string()
    .min(1, "El email es requerido")
    .email("Ingresa un email válido")
    .max(100, "El email no puede exceder 100 caracteres"),

  razonSocial: z
    .string()
    .min(1, "La razón social es requerida")
    .min(3, "La razón social debe tener al menos 3 caracteres")
    .max(200, "La razón social no puede exceder 200 caracteres"),

  tipo: z.enum(["Empresa", "Productor"], {
    errorMap: () => ({ message: "Selecciona un tipo de cliente válido" }),
  }),

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

  idLocalidad: z
    .number({
      required_error: "La localidad es requerida",
      invalid_type_error: "Selecciona una localidad válida",
    })
    .int("Selecciona una localidad válida")
    .positive("Selecciona una localidad válida"),

  observaciones: z
    .string()
    .max(500, "Las observaciones no pueden exceder 500 caracteres")
    .optional()
    .or(z.literal("")),
});

/**
 * Schema para editar cliente (mismo que crear)
 */
export const editClienteSchema = createClienteSchema;

/**
 * Schema dinámico: usa create o edit según el modo
 */
export const getClienteSchema = (mode) => {
  return mode === "create" ? createClienteSchema : editClienteSchema;
};
