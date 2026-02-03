import { z } from "zod";

const gastoBaseSchema = z.object({
  detalle: z
    .string()
    .min(1, "El detalle es requerido")
    .max(200, "El detalle no puede tener más de 200 caracteres"),

  monto: z
    .number({ invalid_type_error: "El monto debe ser un número" })
    .positive("El monto debe ser mayor a 0"),

  tipo: z.enum(["Combustible", "Peaje", "Viatico"], {
    errorMap: () => ({
      message: "Debe seleccionar un tipo válido (Combustible, Peaje o Viático)",
    }),
  }),

  idViaje: z
    .number({ invalid_type_error: "Debe seleccionar un viaje" })
    .int("Debe seleccionar un viaje válido")
    .positive("Debe seleccionar un viaje válido"),
});

// Schema para creación (todos los campos requeridos)
const createGastoSchema = gastoBaseSchema;

// Schema para edición (campos opcionales)
const editGastoSchema = gastoBaseSchema.partial();

export const getGastoSchema = (mode = "create") => {
  return mode === "create" ? createGastoSchema : editGastoSchema;
};
