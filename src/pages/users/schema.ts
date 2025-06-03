import { z } from "zod";

export const createUserSchema = z.object({
  email: z
    .string({
      required_error: "Debes ingresar un e-mail",
      invalid_type_error: "Ingresa tu e-mail en un formato correcto",
    })
    .email({
      message: "Formato de e-mail inválido",
    }),
  fullName: z
    .string({
      required_error: "Debes ingresar el nombre completo",
    })
    .min(1, "Debes ingresar un nombre para tu usuario"),
  role: z.string({
    required_error: "Debes seleccionar un rol",
  }),
  company_id: z.string({
    required_error: "Debes asignar una empresa para el usuario",
  }),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
