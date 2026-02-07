import { z } from "zod";

const viajeBaseSchema = z.object({
  idChofer: z.coerce
    .number({ invalid_type_error: "Debe seleccionar un chofer" })
    .int("Debe seleccionar un chofer válido")
    .positive("Debe seleccionar un chofer válido"),

  idVehiculo: z.coerce
    .number({ invalid_type_error: "Debe seleccionar un vehículo" })
    .int("Debe seleccionar un vehículo válido")
    .positive("Debe seleccionar un vehículo válido"),

  idCliente: z.coerce
    .number({ invalid_type_error: "Debe seleccionar un cliente" })
    .int("Debe seleccionar un cliente válido")
    .positive("Debe seleccionar un cliente válido"),

  idLocalidadOrigen: z.coerce
    .number({ invalid_type_error: "Debe seleccionar una localidad de origen" })
    .int("Debe seleccionar una localidad de origen válida")
    .positive("Debe seleccionar una localidad de origen válida"),

  idLocalidadDestino: z.coerce
    .number({ invalid_type_error: "Debe seleccionar una localidad de destino" })
    .int("Debe seleccionar una localidad de destino válida")
    .positive("Debe seleccionar una localidad de destino válida"),

  fechaInicio: z
    .string()
    .min(1, "La fecha de inicio es requerida")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "El formato de fecha debe ser YYYY-MM-DD"),

  fechaFin: z
    .string()
    .min(1, "La fecha de fin es requerida")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "El formato de fecha debe ser YYYY-MM-DD"),

  kilometros: z.coerce
    .number({ invalid_type_error: "Los kilómetros deben ser un número" })
    .nonnegative("Los kilómetros no pueden ser negativos")
    .min(0, "Los kilómetros deben ser mayor o igual a 0"),

  precio: z.coerce
    .number({ invalid_type_error: "El precio debe ser un número" })
    .positive("El precio debe ser mayor a 0"),

  observaciones: z
    .string()
    .max(500, "Las observaciones no pueden tener más de 500 caracteres")
    .optional()
    .or(z.literal("")),
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
).refine(
  (data) => {
    return data.idLocalidadOrigen !== data.idLocalidadDestino;
  },
  {
    message: "La localidad de origen y destino no pueden ser iguales",
    path: ["idLocalidadDestino"],
  }
);

// Schema para edición que incluye estado y motivoCancelacion
const editViajeSchema = z.object({
  idChofer: z.coerce
    .number({ invalid_type_error: "Debe seleccionar un chofer" })
    .int("Debe seleccionar un chofer válido")
    .positive("Debe seleccionar un chofer válido")
    .optional(),

  idVehiculo: z.coerce
    .number({ invalid_type_error: "Debe seleccionar un vehículo" })
    .int("Debe seleccionar un vehículo válido")
    .positive("Debe seleccionar un vehículo válido")
    .optional(),

  idCliente: z.coerce
    .number({ invalid_type_error: "Debe seleccionar un cliente" })
    .int("Debe seleccionar un cliente válido")
    .positive("Debe seleccionar un cliente válido")
    .optional(),

  idLocalidadOrigen: z.coerce
    .number({ invalid_type_error: "Debe seleccionar una localidad de origen" })
    .int("Debe seleccionar una localidad de origen válida")
    .positive("Debe seleccionar una localidad de origen válida")
    .optional(),

  idLocalidadDestino: z.coerce
    .number({ invalid_type_error: "Debe seleccionar una localidad de destino" })
    .int("Debe seleccionar una localidad de destino válida")
    .positive("Debe seleccionar una localidad de destino válida")
    .optional(),

  fechaInicio: z
    .string()
    .min(1, "La fecha de inicio es requerida")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "El formato de fecha debe ser YYYY-MM-DD")
    .optional(),

  fechaFin: z
    .string()
    .min(1, "La fecha de fin es requerida")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "El formato de fecha debe ser YYYY-MM-DD")
    .optional(),

  kilometros: z.coerce
    .number({ invalid_type_error: "Los kilómetros deben ser un número" })
    .nonnegative("Los kilómetros no pueden ser negativos")
    .min(0, "Los kilómetros deben ser mayor o igual a 0")
    .optional(),

  precio: z.coerce
    .number({ invalid_type_error: "El precio debe ser un número" })
    .positive("El precio debe ser mayor a 0")
    .optional(),

  estado: z.enum(["CANCELADO"], {
    errorMap: () => ({
      message: "Solo se puede cambiar el estado a CANCELADO",
    }),
  }).optional(),

  motivoCancelacion: z
    .string()
    .min(1, "El motivo de cancelación es requerido si se cancela el viaje")
    .max(500, "El motivo de cancelación no puede tener más de 500 caracteres")
    .optional()
    .or(z.literal("")),

  observaciones: z
    .string()
    .max(500, "Las observaciones no pueden tener más de 500 caracteres")
    .optional()
    .or(z.literal("")),
}).refine(
  (data) => {
    // Si se proporciona estado CANCELADO, debe haber motivoCancelacion
    if (data.estado === "CANCELADO" && !data.motivoCancelacion) {
      return false;
    }
    return true;
  },
  {
    message: "Debe proporcionar un motivo de cancelación",
    path: ["motivoCancelacion"],
  }
);

// Schema para creación (todos los campos requeridos)
const createViajeSchema = viajeBaseSchema;

export const getViajeSchema = (mode = "create") => {
  return mode === "create" ? createViajeSchema : editViajeSchema;
};
