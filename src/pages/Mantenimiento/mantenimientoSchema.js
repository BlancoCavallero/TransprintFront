import { z } from "zod";

const mantenimientoBaseSchema = z.object({
  fechaInicio: z
    .string()
    .min(1, "La fecha de inicio es requerida")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "El formato de fecha debe ser YYYY-MM-DD"),

  fechaFin: z
    .string()
    .min(1, "La fecha de fin es requerida")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "El formato de fecha debe ser YYYY-MM-DD"),

  tipo: z.enum(["Preventivo", "Correctivo"], {
    errorMap: () => ({
      message: "Debe seleccionar un tipo válido (Preventivo o Correctivo)",
    }),
  }),

  observacion: z
    .string()
    .max(500, "Las observaciones no pueden tener más de 500 caracteres")
    .optional()
    .or(z.literal("")),

  idVehiculo: z
  .string()
  .min(1, "Debe venir el vehículo"),
}).refine(
  (data) => {
    const inicio = new Date(data.fechaInicio);
    const fin = new Date(data.fechaFin);
    return fin >= inicio;
  },
  {
    message: "La fecha de fin debe ser posterior o igual a la fecha de inicio",
    path: ["fechaFin"],
  }
);

// Schema para creación (todos los campos requeridos)
const createMantenimientoSchema = mantenimientoBaseSchema;

// Schema para edición (campos opcionales excepto las fechas y tipo si se envían)
const editMantenimientoSchema = mantenimientoBaseSchema.partial();

export const getMantenimientoSchema = (mode = "create") => {
  return mode === "create" ? createMantenimientoSchema : editMantenimientoSchema;
};
