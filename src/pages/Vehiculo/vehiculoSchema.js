import { z } from "zod";

const vehiculoBaseSchema = z.object({
  patente: z
    .string()
    .min(6, "La patente debe tener al menos 6 caracteres")
    .max(10, "La patente no puede tener más de 10 caracteres")
    .regex(/^[A-Z0-9]+$/i, "La patente solo puede contener letras y números"),

  marca: z
    .string()
    .min(2, "La marca debe tener al menos 2 caracteres")
    .max(50, "La marca no puede tener más de 50 caracteres"),

  modelo: z
    .string()
    .min(1, "El modelo es requerido")
    .max(50, "El modelo no puede tener más de 50 caracteres"),

  anio: z
    .string()
    .regex(/^\d{4}$/, "El año debe tener 4 dígitos")
    .refine((val) => {
      const year = parseInt(val);
      const currentYear = new Date().getFullYear();
      return year >= 1900 && year <= currentYear + 1;
    }, "El año debe estar entre 1900 y el año actual"),

  // TODO: Eliminar este campo cuando el backend implemente el estado automático
  // estado: z.enum(["Activo", "Inactivo", "En mantenimiento"], {
  //   errorMap: () => ({ message: "Debe seleccionar un estado válido" }),
  // }),

  tipo: z.enum(["LIGERO", "MEDIANO", "PESADO", "TERAPESADO"], {
    errorMap: () => ({
      message: "Debe seleccionar un tipo válido (LIGERO, MEDIANO, PESADO o TERAPESADO)",
    }),
  }),
});

// Schema para creación (todos los campos requeridos)
const createVehiculoSchema = vehiculoBaseSchema;

// Schema para edición (todos los campos son opcionales)
const editVehiculoSchema = vehiculoBaseSchema.partial();

export const getVehiculoSchema = (mode = "create") => {
  return mode === "create" ? createVehiculoSchema : editVehiculoSchema;
};
