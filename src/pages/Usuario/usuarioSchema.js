import * as z from "zod";

/**
 * Schema de validación para crear/editar usuarios
 * Utiliza Zod para validar los datos del formulario
 */

export const createUsuarioSchema = z.object({
  nombre_completo: z
    .string()
    .min(1, "El nombre completo es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .regex(
      /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/,
      "El nombre solo puede contener letras y espacios",
    ),

  username: z
    .string()
    .min(1, "El nombre de usuario es requerido")
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .max(30, "El usuario no puede exceder 30 caracteres")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "El usuario solo puede contener letras, números, guiones y guiones bajos",
    )
    .regex(/^[a-zA-Z]/, "El usuario debe comenzar con una letra"),

  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Ingresa un email válido")
    .max(100, "El email no puede exceder 100 caracteres"),

  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .min(1, "La contraseña es requerida")
    .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
    .regex(/[0-9]/, "Debe contener al menos un número")
    .regex(
      /[@$!%*#?&]/,
      "Debe contener al menos un carácter especial (@$!%*#?&)",
    )
    .max(50, "La contraseña no puede exceder 50 caracteres"),

  role: z.enum(["Empleado", "Administrador"], {
    errorMap: () => ({ message: "Selecciona un rol válido" }),
  }),
});

/**
 * Schema para editar usuario (password es opcional)
 */
export const editUsuarioSchema = createUsuarioSchema
  .omit({ password: true })
  .extend({
    password: z
      .string()
      .max(50, "La contraseña no puede exceder 50 caracteres")
      .optional()
      .refine(
        (val) => {
          if (!val || val.trim() === "") return true; // Permite vacío
          if (val.length < 8) return false;
          if (!/[A-Z]/.test(val)) return false;
          if (!/[a-z]/.test(val)) return false;
          if (!/[0-9]/.test(val)) return false;
          if (!/[@$!%*#?&]/.test(val)) return false;
          return true;
        },
        {
          message:
            "La contraseña debe cumplir con los requisitos: mín. 8 caracteres, mayúscula, minúscula, número y carácter especial",
        },
      ),
  });

/**
 * Schema dinámico: usa create o edit según el modo
 */
export const getUsuarioSchema = (mode) => {
  return mode === "create" ? createUsuarioSchema : editUsuarioSchema;
};
