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
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
